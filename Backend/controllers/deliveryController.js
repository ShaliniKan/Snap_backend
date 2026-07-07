const DeliveryZone = require("../Modules/DeliveryZone");
const { checkPincode } = require("../utils/deliveryHelpers");

const validatePincode = async (req, res) => {
    try {
        const result = await checkPincode(req.params.pincode);

        if (!result.ok) {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            success: true,
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const listDeliveryZones = async (req, res) => {
    try {
        const zones = await DeliveryZone.find().sort({ pincode: 1 });
        return res.status(200).json({ success: true, data: zones });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createDeliveryZone = async (req, res) => {
    try {
        const zone = await DeliveryZone.create(req.body);
        return res.status(201).json({ success: true, data: zone });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    validatePincode,
    listDeliveryZones,
    createDeliveryZone,
};
