const mongoose = require("mongoose");
const Categories = require("../Modules/Categories");

const categoryNames = [
    "Men",
    "Women",
    "Footwear",
    "Home & Kitchen",
    "Watches",
    "Electronics",
    "Mobiles Accessories",
    "Home Furnishing",
    "Beauty & Personal Care",
    "Kids",
];

const subcategoryMap = {
    Men: ["Formal Wear", "Casual Wear", "Ethnic Wear", "Sports Wear"],
    Women: ["Western Wear", "Ethnic Wear", "Footwear", "Accessories"],
    Electronics: ["Mobiles", "Laptops", "Audio", "Cameras"],
    "Home & Kitchen": ["Cookware", "Furniture", "Decor", "Appliances"],
    Kids: ["Boys Clothing", "Girls Clothing", "Toys", "School Supplies"],
};

const seedCategories = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/apnamart_db");

    const existingCategories = await Categories.find({
        itemName: { $in: categoryNames },
        parentCategoryId: null,
    }).lean();

    const existingNames = new Set(existingCategories.map((category) => category.itemName));
    const newCategories = categoryNames
        .filter((itemName) => !existingNames.has(itemName))
        .map((itemName) => ({ itemName, parentCategoryId: null }));

    if (newCategories.length > 0) {
        await Categories.insertMany(newCategories);
    }

    const rootCategories = await Categories.find({ parentCategoryId: null })
        .sort({ createdAt: 1 })
        .lean();

    for (const rootCategory of rootCategories) {
        const childNames = subcategoryMap[rootCategory.itemName] || [];
        for (const childName of childNames) {
            const existingChild = await Categories.findOne({
                itemName: childName,
                parentCategoryId: rootCategory._id,
            });

            if (!existingChild) {
                await Categories.create({
                    itemName: childName,
                    parentCategoryId: rootCategory._id,
                });
            }
        }
    }

    const allCategories = await Categories.find({}).sort({ parentCategoryId: 1, itemName: 1 }).lean();

    console.log(
        JSON.stringify(
            {
                inserted: newCategories.length,
                rootCount: rootCategories.length,
                categories: allCategories.map((category) => ({
                    id: category._id,
                    itemName: category.itemName,
                    parentCategoryId: category.parentCategoryId,
                })),
            },
            null,
            2
        )
    );

    await mongoose.disconnect();
};

seedCategories().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
});
