const DeliveryZone = require("../Modules/DeliveryZone");

const DEFAULT_DELIVERY = {
    deliveryCharge: 49,
    estimatedDays: 5,
    isServiceable: true,
};

const checkPincode = async (pincode = "") => {
    const normalized = String(pincode).trim();

    if (!/^[1-9][0-9]{5}$/.test(normalized)) {
        return {
            ok: false,
            message: "Enter a valid 6-digit pincode",
        };
    }

    const zone = await DeliveryZone.findOne({ pincode: normalized });

    if (!zone) {
        return {
            ok: true,
            data: {
                pincode: normalized,
                ...DEFAULT_DELIVERY,
                city: "",
                state: "",
            },
        };
    }

    if (!zone.isServiceable) {
        return {
            ok: false,
            message: "Delivery is not available for this pincode",
        };
    }

    return {
        ok: true,
        data: {
            pincode: zone.pincode,
            city: zone.city,
            state: zone.state,
            deliveryCharge: zone.deliveryCharge,
            estimatedDays: zone.estimatedDays,
            isServiceable: zone.isServiceable,
        },
    };
};

module.exports = {
    checkPincode,
    DEFAULT_DELIVERY,
};
