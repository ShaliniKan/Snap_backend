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

            selected_size: {
                type: String,
                default: ""
            },

            selected_color: {
                type: String,
                default: ""
            },

            quantity: {
                type: Number,
                default: 1,
                min: 1
            },

            price: {
                type: Number,
                required: true
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
