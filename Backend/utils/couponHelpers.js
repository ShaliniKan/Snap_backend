const Coupon = require("../Modules/Coupon");

const calculateCouponDiscount = (coupon, subtotal = 0) => {
    if (!coupon || subtotal < coupon.minOrderAmount) {
        return 0;
    }

    let discount = 0;

    if (coupon.discountType === "flat") {
        discount = coupon.discountValue;
    } else {
        discount = (subtotal * coupon.discountValue) / 100;
    }

    if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
    }

    return Math.min(discount, subtotal);
};

const validateCoupon = async (code, subtotal = 0) => {
    if (!code) {
        return { ok: false, message: "Coupon code is required" };
    }

    const coupon = await Coupon.findOne({ code: String(code).trim().toUpperCase(), isActive: true });

    if (!coupon) {
        return { ok: false, message: "Invalid coupon code" };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return { ok: false, message: "Coupon has expired" };
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return { ok: false, message: "Coupon usage limit reached" };
    }

    if (subtotal < coupon.minOrderAmount) {
        return { ok: false, message: `Minimum order amount is ₹${coupon.minOrderAmount}` };
    }

    const discountAmount = calculateCouponDiscount(coupon, subtotal);

    return {
        ok: true,
        coupon,
        discountAmount,
    };
};

module.exports = {
    calculateCouponDiscount,
    validateCoupon,
};
