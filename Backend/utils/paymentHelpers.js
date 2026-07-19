const crypto = require("crypto");

const isRazorpayEnabled = () =>
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    if (!isRazorpayEnabled()) {
        return true;
    }

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return expectedSignature === signature;
};

module.exports = {
    isRazorpayEnabled,
    verifyRazorpaySignature,
};
