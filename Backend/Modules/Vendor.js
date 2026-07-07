const mongoose = require('mongoose');
const vendorSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    businessAddress:{
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/
    },
    isApproved: {
        type:Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Vendor",vendorSchema);
