const Order = require("../Modules/Order");
const Razorpay = require("razorpay");
const { isRazorpayEnabled, verifyRazorpaySignature } = require("../utils/paymentHelpers");

const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;
        const amountPaise = Math.round(Number(amount) * 100);

        if (!amountPaise || amountPaise <= 0) {
            return res.status(400).json({ success: false, message: "Invalid payment amount" });
        }

        if (isRazorpayEnabled()) {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const order = await razorpay.orders.create({
                amount: amountPaise,
                currency,
                receipt: `apnamart_${Date.now()}`,
            });

            return res.status(200).json({
                success: true,
                data: {
                    provider: "razorpay",
                    keyId: process.env.RAZORPAY_KEY_ID,
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                },
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                provider: "mock",
                orderId: `mock_${Date.now()}`,
                amount: amountPaise,
                currency,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (isRazorpayEnabled()) {
            if (
                !verifyRazorpaySignature(
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                )
            ) {
                return res.status(400).json({ success: false, message: "Payment verification failed" });
            }
        }

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                payment_status: "paid",
                razorpay_order_id: razorpay_order_id || "",
                razorpay_payment_id: razorpay_payment_id || "",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentConfig = async (_req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            razorpayEnabled: isRazorpayEnabled(),
            keyId: isRazorpayEnabled() ? process.env.RAZORPAY_KEY_ID : null,
        },
    });
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getPaymentConfig,
    isRazorpayEnabled,
};
