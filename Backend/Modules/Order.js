const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    mobile: { type: String, trim: true },
    pincode: { type: String, trim: true },
    houseNo: { type: String, trim: true },
    street: { type: String, trim: true },
    area: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    landmark: { type: String, trim: true },
}, { _id: false });

const orderSchema = mongoose.Schema(
{
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Variant"
            },

            quantity: Number,

            price: Number
        }
    ],

    total_amount: {
        type: Number,
        required: true
    },

    subtotal: {
        type: Number,
        default: 0,
    },

    discount_amount: {
        type: Number,
        default: 0,
    },

    delivery_charge: {
        type: Number,
        default: 0,
    },

    coupon_code: {
        type: String,
        trim: true,
        uppercase: true,
    },

    estimated_delivery_days: {
        type: Number,
        default: 5,
    },

    razorpay_order_id: {
        type: String,
        default: "",
    },

    razorpay_payment_id: {
        type: String,
        default: "",
    },

    payment_method: {
        type: String,
        enum: ["cod", "upi", "card", "debit", "netbanking", "wallet"],
        default: "cod"
    },

    payment_status: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed"
        ],
        default: "pending"
    },

    order_status: {
        type: String,
        enum: [
            "placed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "placed"
    },

    shipping_address: shippingAddressSchema
},
{
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
