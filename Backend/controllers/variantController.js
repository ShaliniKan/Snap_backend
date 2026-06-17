const Variant = require('../Modules/Product_Variant');

const createVariants= async(req, res) =>{
    try{
        const variant = await Variant.create({...req.body, product_id: req.params.product_id })
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

const getVariants = async(req,res)=>{
    try{
        const variant = await Variant.find({product_id: req.params.product_id})
        if(!variant){
            return res.status(500).json({
                success:false,
                message:"No variants found!!"
            });
        }
        res.status(200).json(variant);
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getVariantsById = async(req,res)=>{
    try{
        const variant = await Variant.findById(req.params.id)
        if(!variant){
            return res.status(404).json({
                success:false,
                message:"No variants found!!"
            });
        }
        res.status(200).json(variant);
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const putVariants = async(req,res)=>{
    try{
        const variant = await Variant.findByIdAndUpdate(req.param.id, req.body,{new: true})
        if(!variant){
           return res.status(404).json({
                success:false,
                message:"No variants found!!"
            });  
        }
        res.status(200).json(variant);
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteVariants = async(req,res)=> {
    try{
        const deleteVariant = await Variant.findByIdAndDelete(req.params.id);
            if(!deleteVariant){
                return res.status(404).json({success: false, message: "Product Variant not found"});
            }
            res.status(200).json(deleteVariant);
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
}

module.exports = {createVariants,getVariants,getVariantsById,putVariants,deleteVariants};
