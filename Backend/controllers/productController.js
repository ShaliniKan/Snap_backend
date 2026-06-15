const Product = require('../Modules/Product');

const createProduct = async(req, res) =>{
    try{
        const product = await Product.create(req.body)
        res.status(201).json({
            success: true,
            message: "Product is created successfully",
            data: product
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProduct
};
