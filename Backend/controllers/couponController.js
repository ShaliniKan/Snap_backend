const Coupon = require("../Modules/Coupon");
const { validateCoupon } = require("../utils/couponHelpers");

const validateCouponCode = async (req, res) => {
    try {
        const { code, subtotal = 0 } = req.body;
        const result = await validateCoupon(code, Number(subtotal));

        if (!result.ok) {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                code: result.coupon.code,
                description: result.coupon.description,
                discountAmount: result.discountAmount,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const listCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        return res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.couponId, req.body, { new: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }
        return res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.couponId);
        return res.status(200).json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    validateCouponCode,
    listCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};
