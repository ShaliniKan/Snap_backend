const Categories = require("../Modules/Categories");

const getAllCategories = async(req,res) => {
    try{
        const categories = await Categories.find({parentCategoryId: null});
        res.status(200).json(categories);
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getSubCategories = async(req,res)=> {
    try{
        const subCategories = await Categories.find({parentCategoryId: req.params.parentCategoryId});
        res.status(200).json(subCategories);
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createCategory = async(req,res)=> {
    try{
        const createCategory = await Categories.create({...req.body, parentCategoryId: null});
        res.status(201).json({
            success: true,
            message: "Category is created successfully",
            data: product
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createSubcategory = async(req,res)=> {
    try{
        const createCategory = await Categories.create({...req.body, parentCategoryId: req.params.parentCategoryId});
        res.status(201).json({
            success: true,
            message: "SubCategory is created successfully",
            data: product
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const putCategory = async(req,res)=> {
    try{
    const updateCategory = await Categories.findByIdAndUpdate(req.params.id, req.body,{new: true});
    if(!updateCategory){
        return res.status(404).json({success: false, message: "Category not found"});
    }
    res.status(201).json(updateCategory);
    } catch(error){
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const putSubcategory = async(req,res)=>{
    try{
    const updateSubcategory = await Categories.findByIdAndUpdate(req.params.id, req.body,{new: true});
    if(!updateSubcategory){
        return res.status(404).json({success: false, message: "Category not found"});
    }
    res.status(201).json(updateSubcategory);
    } catch(error){
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCategory = async(req,res)=> {
    try{
    const deleteCategory = await Categories.findById(req.param.id);
    if(!deleteCategory){
       return res.status(404).json({success: false, message: "Category not found"}); 
    }
    const subcategories = await Categories.find({parentCategoryId: deleteCategory._id});
    if(subcategories.length>0){
        return res.status(404).json({success: false, message: "Cannot delete category. Delete its subcategories first."});
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Category deleted successfully"});
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Category.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Subcategory deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {getAllCategories,getSubCategories,createCategory,createSubcategory,
                  putCategory,putSubcategory,deleteCategory,deleteSubcategory};