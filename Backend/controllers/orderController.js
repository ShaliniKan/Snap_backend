const Cart = require("../Modules/Cart");
const Order = require("../Modules/Order");
const Product = require("../Modules/Product");
const Variant = require("../Modules/Product_Variant");
const User = require("../Modules/Users");
const Coupon = require("../Modules/Coupon");
const { getUserId, getVendorProductIds } = require("../utils/vendorHelpers");
const { validateCoupon } = require("../utils/couponHelpers");
const { checkPincode } = require("../utils/deliveryHelpers");
const { sendOrderConfirmationEmail } = require("../utils/emailService");
const { isRazorpayEnabled, verifyRazorpaySignature } = require("../utils/paymentHelpers");

const restoreStock = async (items = []) => {
    for (const item of items) {
        if (item.variant_id) {
            await Variant.findByIdAndUpdate(item.variant_id, {
                $inc: { stock_quantity: item.quantity },
            });
        } else if (item.product_id) {
            await Product.findByIdAndUpdate(item.product_id, {
                $inc: { quantity: item.quantity },
            });
        }
    }
};

const deductStock = async (items = []) => {
    for (const item of items) {
        if (item.variant_id) {
            await Variant.findByIdAndUpdate(item.variant_id, {
                $inc: { stock_quantity: -item.quantity },
            });
        } else if (item.product_id) {
            await Product.findByIdAndUpdate(item.product_id, {
                $inc: { quantity: -item.quantity },
            });
        }
    }
};

const validateCartStock = async (items = []) => {
    for (const item of items) {
        if (item.variant_id) {
            const variant = await Variant.findById(item.variant_id);

            if (!variant) {
                return { ok: false, status: 404, message: "Variant not found" };
            }

            if (variant.stock_quantity < item.quantity) {
                return { ok: false, status: 400, message: "Insufficient stock for one or more items" };
            }

            continue;
        }

        const product = await Product.findById(item.product_id);

        if (!product) {
            return { ok: false, status: 404, message: "Product not found" };
        }

        if (product.quantity < item.quantity) {
            return { ok: false, status: 400, message: "Insufficient stock for one or more items" };
        }
    }

    return { ok: true };
};

const createOrder = async (req, res) => {
    try {
        const {
            shipping_address,
            payment_method = "cod",
            coupon_code,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const cart = await Cart.findOne({ customer_id: req.user.id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty",
            });
        }

        const stockCheck = await validateCartStock(cart.items);

        if (!stockCheck.ok) {
            return res.status(stockCheck.status).json({
                success: false,
                message: stockCheck.message,
            });
        }

        const pincodeCheck = await checkPincode(shipping_address?.pincode);

        if (!pincodeCheck.ok) {
            return res.status(400).json({
                success: false,
                message: pincodeCheck.message,
            });
        }

        const subtotal = cart.total_amount;
        let discountAmount = 0;
        let appliedCouponCode = "";

        if (coupon_code) {
            const couponResult = await validateCoupon(coupon_code, subtotal);

            if (!couponResult.ok) {
                return res.status(400).json({
                    success: false,
                    message: couponResult.message,
                });
            }

            discountAmount = couponResult.discountAmount;
            appliedCouponCode = couponResult.coupon.code;
        }

        const deliveryCharge = pincodeCheck.data.deliveryCharge || 0;
        const totalAmount = Math.max(0, subtotal - discountAmount + deliveryCharge);
        const isOnlinePayment = payment_method !== "cod";
        let paymentStatus = "pending";

        if (isOnlinePayment) {
            if (isRazorpayEnabled()) {
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    return res.status(400).json({
                        success: false,
                        message: "Payment verification is required for online payments",
                    });
                }

                if (
                    !verifyRazorpaySignature(
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Payment verification failed",
                    });
                }

                paymentStatus = "paid";
            } else {
                paymentStatus = "paid";
            }
        }

        const order = await Order.create({
            customer_id: req.user.id,
            items: cart.items.map((item) => ({
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price,
            })),
            subtotal,
            discount_amount: discountAmount,
            delivery_charge: deliveryCharge,
            coupon_code: appliedCouponCode || undefined,
            estimated_delivery_days: pincodeCheck.data.estimatedDays,
            total_amount: totalAmount,
            payment_method,
            payment_status: paymentStatus,
            razorpay_order_id: razorpay_order_id || "",
            razorpay_payment_id: razorpay_payment_id || "",
            shipping_address,
        });

        if (appliedCouponCode) {
            await Coupon.findOneAndUpdate(
                { code: appliedCouponCode },
                { $inc: { usedCount: 1 } }
            );
        }

        await deductStock(cart.items);

        cart.items = [];
        cart.total_amount = 0;
        await cart.save();

        await order.populate("items.product_id");
        await order.populate("items.variant_id");

        const customer = await User.findById(req.user.id);
        if (customer?.email) {
            sendOrderConfirmationEmail({
                email: customer.email,
                orderId: order._id,
                totalAmount: order.total_amount,
            }).catch(() => {});
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer_id: req.user.id })
            .populate("items.product_id")
            .populate("items.variant_id")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            customer_id: req.user.id,
        })
            .populate("items.product_id")
            .populate("items.variant_id");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            customer_id: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.order_status === "shipped" || order.order_status === "delivered") {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled",
            });
        }

        if (order.order_status !== "cancelled") {
            await restoreStock(order.items);
            order.order_status = "cancelled";
            await order.save();
        }

        return res.status(200).json({
            success: true,
            message: "Order cancelled",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getVendorOrders = async (req, res) => {
    try {
        const productIds = await getVendorProductIds(getUserId(req.user));

        if (productIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        const orders = await Order.find({ "items.product_id": { $in: productIds } })
            .populate("customer_id", "firstName lastName email")
            .populate("items.product_id")
            .populate("items.variant_id")
            .sort({ createdAt: -1 });

        const data = orders
            .map((order) => {
                const vendorItems = order.items.filter((item) =>
                    productIds.some((productId) => productId.toString() === item.product_id._id.toString())
                );

                return {
                    ...order.toObject(),
                    items: vendorItems,
                    vendor_total: vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                };
            })
            .filter((order) => order.items.length > 0);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateVendorOrderStatus = async (req, res) => {
    try {
        const { order_status } = req.body;
        const allowedStatuses = ["processing", "shipped", "delivered"];
        const productIds = await getVendorProductIds(getUserId(req.user));

        if (!allowedStatuses.includes(order_status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status for vendor update",
            });
        }

        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const hasVendorItems = order.items.some((item) =>
            productIds.some((productId) => productId.toString() === item.product_id.toString())
        );

        if (!hasVendorItems) {
            return res.status(403).json({
                success: false,
                message: "This order does not include your products",
            });
        }

        order.order_status = order_status;
        await order.save();
        await order.populate("items.product_id");
        await order.populate("items.variant_id");

        return res.status(200).json({
            success: true,
            message: "Order status updated",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder, getVendorOrders, updateVendorOrderStatus };
