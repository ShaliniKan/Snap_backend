const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        customer_name: {
            type: String,
            trim: true,
            default: "",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
    },
    { timestamps: true }
);

reviewSchema.index({ product_id: 1, customer_id: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
