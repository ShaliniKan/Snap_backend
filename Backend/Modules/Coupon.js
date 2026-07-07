const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        discountType: {
            type: String,
            enum: ["percent", "flat"],
            default: "percent",
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        minOrderAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxDiscount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
        },
        usageLimit: {
            type: Number,
            default: 0,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
