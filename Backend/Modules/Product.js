const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subcategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    name: {
        type: String,
        reuired: true,
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["active","inactive", "out_of_stock"],
        default: "active"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
