const Order = require("../Modules/Order");
const Return = require("../Modules/Return");
const User = require("../Modules/Users");
const Coupon = require("../Modules/Coupon");

const getAdminDashboard = async (req, res) => {
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

const getAdminOrders = async (req, res) => {
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

const updateAdminOrderStatus = async (req, res) => {
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
    getAdminDashboard,
    getAdminOrders,
    updateAdminOrderStatus,
};
