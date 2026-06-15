const Vendor = require('../Modules/Vendor');

const createVendor = async(req, res) =>{
    try{
        const vendor = await Vendor.create(req.body)
        res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: vendor
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createVendor
};
