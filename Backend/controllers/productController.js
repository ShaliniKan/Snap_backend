const Product = require('../Modules/Product');
const Variant = require('../Modules/Product_Variant');

const createProduct = async(req, res) =>{
    try{
        const product = await Product.create({...req.body, vendor_id: req.user.usreId})
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

const getAllProduct = async(req,res) => {
    try{
        const product = await Product.find();
        res.status(200).json(product);
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getProductByID = async(req,res)=> {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({success: false, message: "Product not found"})
        }
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const putProduct = async(req,res) => {
    try{
        const updateProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updateProduct){
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json(updateProduct);
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async(req,res) => {
    try{ const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deleteProduct){
            return res.status(404).json({success: false, message: "Product not found"});
        }
        const variant = await Variant.find({product_id: deleteProduct._id})
            if(variant.length>0){
                return res.status(404).json({success: false, message: "Cannot delete Product. Delete its variants first."});
            }
            await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteProduct);
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createProduct,getAllProduct,getProductByID,putProduct,deleteProduct};
