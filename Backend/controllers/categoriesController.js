const Categories = require("../Modules/Categories");
const { buildCategoryResponse, sortRootCategories } = require("../utils/categoryHelpers");

const getAllCategories = async(req,res) => {
    try{
        const categories = await Categories.find({parentCategoryId: null}).lean();
        const subcategoryCounts = await Categories.aggregate([
            { $match: { parentCategoryId: { $ne: null } } },
            { $group: { _id: "$parentCategoryId", count: { $sum: 1 } } },
        ]);

        const countMap = subcategoryCounts.reduce((map, entry) => {
            map[entry._id.toString()] = entry.count;
            return map;
        }, {});

        const enrichedCategories = categories.map((category) => ({
            ...category,
            subcategoryCount: countMap[category._id.toString()] || 0,
        }));

        res.status(200).json(sortRootCategories(enrichedCategories, countMap));
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getCategoryWithChildren = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const children = await Categories.find({ parentCategoryId: category._id }).sort({ itemName: 1 });
        res.status(200).json(buildCategoryResponse(category.toObject ? category.toObject() : category, children));
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSubCategories = async(req,res)=> {
    try{
        const subCategories = await Categories.find({parentCategoryId: req.params.id}).sort({ itemName: 1 });
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
            data: createCategory
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
        const createCategory = await Categories.create({...req.body, parentCategoryId: req.params.id});
        res.status(201).json({
            success: true,
            message: "SubCategory is created successfully",
            data: createCategory
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
    const updateCategory = await Categories.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true});
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
    const updateSubcategory = await Categories.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true});
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
    const deleteCategory = await Categories.findById(req.params.id);
    if(!deleteCategory){
       return res.status(404).json({success: false, message: "Category not found"}); 
    }
    const subcategories = await Categories.find({parentCategoryId: deleteCategory._id});
    if(subcategories.length>0){
        return res.status(404).json({success: false, message: "Cannot delete category. Delete its subcategories first."});
    }
    await Categories.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Category deleted successfully"});
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Categories.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        await Categories.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Subcategory deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {getAllCategories,getCategoryWithChildren,getSubCategories,createCategory,createSubcategory,
                  putCategory,putSubcategory,deleteCategory,deleteSubcategory};
