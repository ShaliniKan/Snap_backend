const Variant = require('../Modules/Product_Variant');

const createVariant= async(req, res) =>{
    try{
        const variant = await Variant.create(req.body)
        res.status(201).json({
            success: true,
            message: "Variant is created successfully",
            data: variant
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createVariant
};
