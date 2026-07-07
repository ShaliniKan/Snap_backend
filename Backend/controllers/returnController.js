const Return = require("../Modules/Return");
const Order = require("../Modules/Order");
const { getUserId } = require("../utils/vendorHelpers");

const createReturnRequest = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;
        const customerId = getUserId(req.user);

        const order = await Order.findOne({ _id: orderId, customer_id: customerId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (!["delivered", "shipped"].includes(order.order_status)) {
            return res.status(400).json({
                success: false,
                message: "Returns are allowed only for shipped or delivered orders",
            });
        }

        const existing = await Return.findOne({ order_id: orderId, customer_id: customerId });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Return request already exists for this order",
            });
        }

        const returnRequest = await Return.create({
            order_id: orderId,
            customer_id: customerId,
            reason,
        });

        return res.status(201).json({
            success: true,
            message: "Return request submitted",
            data: returnRequest,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getMyReturns = async (req, res) => {
    try {
        const returns = await Return.find({ customer_id: getUserId(req.user) })
            .populate("order_id")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: returns });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const listAllReturns = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate("order_id")
            .populate("customer_id", "firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: returns });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateReturnStatus = async (req, res) => {
    try {
        const { status, admin_note } = req.body;
        const returnRequest = await Return.findByIdAndUpdate(
            req.params.returnId,
            { status, admin_note },
            { new: true }
        );

        if (!returnRequest) {
            return res.status(404).json({ success: false, message: "Return request not found" });
        }

        return res.status(200).json({ success: true, data: returnRequest });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createReturnRequest,
    getMyReturns,
    listAllReturns,
    updateReturnStatus,
};
