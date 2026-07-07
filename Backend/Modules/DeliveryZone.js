const mongoose = require("mongoose");

const deliveryZoneSchema = mongoose.Schema(
    {
        pincode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: /^[1-9][0-9]{5}$/,
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        deliveryCharge: {
            type: Number,
            default: 0,
            min: 0,
        },
        estimatedDays: {
            type: Number,
            default: 5,
            min: 1,
        },
        isServiceable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DeliveryZone", deliveryZoneSchema);
