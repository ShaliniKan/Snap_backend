const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
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
                ref: "Product",
                required: true
            },

            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Variant"
            },

            quantity: {
                type: Number,
                default: 1
            },

            price: {
                type: Number,
                required: true
            },

            stock: {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: "Product_Variant"
            }
        }
    ],

    total_amount: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);