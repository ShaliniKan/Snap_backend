const User = require("../Modules/Users");
const Vendor = require("../Modules/Vendor");
const Product = require("../Modules/Product");
const Order = require("../Modules/Order");
const Return = require("../Modules/Return");
const Coupon = require("../Modules/Coupon");
const { getUserId, getVendorProductIds } = require("../utils/vendorHelpers");

const getProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: getUserId(req.user) });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found. Complete seller onboarding first.",
                code: "VENDOR_PROFILE_MISSING",
            });
        }

        return res.status(200).json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createProfile = async (req, res) => {
    try {
        const userId = getUserId(req.user);
        const existing = await Vendor.findOne({ userId });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Vendor profile already exists",
            });
        }

        const { businessName, businessAddress, contactNumber } = req.body;

        const vendor = await Vendor.create({
            userId,
            businessName,
            businessAddress,
            contactNumber,
        });

        return res.status(201).json({
            success: true,
            message: "Seller profile created successfully",
            data: vendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: getUserId(req.user) });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found",
            });
        }

        const { businessName, businessAddress, contactNumber } = req.body;

        if (businessName !== undefined) vendor.businessName = businessName;
        if (businessAddress !== undefined) vendor.businessAddress = businessAddress;
        if (contactNumber !== undefined) vendor.contactNumber = contactNumber;

        await vendor.save();

        return res.status(200).json({
            success: true,
            message: "Seller profile updated",
            data: vendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const vendorId = getUserId(req.user);
        const productIds = await getVendorProductIds(vendorId);
        const productCount = productIds.length;

        const orders = await Order.find({ "items.product_id": { $in: productIds } })
            .select("items total_amount order_status createdAt")
            .lean();

        let orderCount = 0;
        let revenue = 0;
        let pendingOrders = 0;

        orders.forEach((order) => {
            const vendorItems = order.items.filter((item) =>
                productIds.some((productId) => productId.toString() === item.product_id.toString())
            );

            if (vendorItems.length === 0) {
                return;
            }

            orderCount += 1;
            revenue += vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            if (["placed", "processing"].includes(order.order_status)) {
                pendingOrders += 1;
            }
        });

        const activeProducts = await Product.countDocuments({
            vendor_id: vendorId,
            status: "active",
        });

        return res.status(200).json({
            success: true,
            data: {
                productCount,
                activeProducts,
                orderCount,
                pendingOrders,
                revenue,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPlatformDashboard = async (req, res) => {
    try {
        const [orderCount, returnCount, pendingReturns, customerCount, vendorCount, couponCount] = await Promise.all([
            Order.countDocuments(),
            Return.countDocuments(),
            Return.countDocuments({ status: "requested" }),
            User.countDocuments({ role: "customer" }),
            User.countDocuments({ role: "vendor" }),
            Coupon.countDocuments({ isActive: true }),
        ]);

        const revenueAgg = await Order.aggregate([
            { $match: { payment_status: { $in: ["paid", "pending"] }, order_status: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$total_amount" } } },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                orderCount,
                returnCount,
                pendingReturns,
                customerCount,
                vendorCount,
                couponCount,
                revenue: revenueAgg[0]?.total || 0,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customer_id", "firstName lastName email")
            .populate("items.product_id")
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({ success: true, data: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updatePlatformOrderStatus = async (req, res) => {
    try {
        const { order_status } = req.body;
        const allowedStatuses = ["placed", "processing", "shipped", "delivered", "cancelled"];

        if (!allowedStatuses.includes(order_status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.order_status = order_status;
        await order.save();
        await order.populate("customer_id", "firstName lastName email");
        await order.populate("items.product_id");

        return res.status(200).json({
            success: true,
            message: "Order status updated",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    getDashboardStats,
    getPlatformDashboard,
    getAllOrders,
    updatePlatformOrderStatus,
};
