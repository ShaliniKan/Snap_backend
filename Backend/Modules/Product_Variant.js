const mongoose = require('mongoose');
const variantSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    color: String,
    size: String,
    price: {
        type: Number,
        require: true
    },
    discount_price: Number,
    stock_quantity: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Variant", variantSchema);
