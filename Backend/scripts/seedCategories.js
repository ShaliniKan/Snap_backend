require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const Categories = require("../Modules/Categories");
const Product = require("../Modules/Product");

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
    Footwear: ["Men's Footwear", "Women's Footwear"],
    Electronics: ["Mobiles", "Laptops", "Audio", "Cameras"],
    "Home & Kitchen": ["Cookware", "Furniture", "Decor", "Appliances"],
    "Home Furnishing": ["Living Room Furniture", "Bedroom Furniture"],
    Kids: ["Boys Clothing", "Girls Clothing", "Toys", "School Supplies"],
};

const legacySubcategoryRefs = {
    "6a4bc6f1abd40a48106bff14": { parentName: "Men", itemName: "Formal Wear" },
    "6a4bc6f1abd40a48106bff15": { parentName: "Men", itemName: "Casual Wear" },
    "6a4bc6f1abd40a48106bff16": { parentName: "Men", itemName: "Ethnic Wear" },
    "6a4bc6f1abd40a48106bff17": { parentName: "Men", itemName: "Sports Wear" },
    "6a4bc6f1abd40a48106bff18": { parentName: "Women", itemName: "Western Wear" },
    "6a4bc6f1abd40a48106bff19": { parentName: "Women", itemName: "Ethnic Wear" },
    "6a4bc6f1abd40a48106bff1a": { parentName: "Women", itemName: "Footwear" },
    "6a4bc6f1abd40a48106bff1b": { parentName: "Women", itemName: "Accessories" },
    "6a4bc6f1abd40a48106bff1c": { parentName: "Home & Kitchen", itemName: "Cookware" },
    "6a4bc6f1abd40a48106bff1d": { parentName: "Home & Kitchen", itemName: "Furniture" },
    "6a4bc6f1abd40a48106bff1e": { parentName: "Home & Kitchen", itemName: "Decor" },
    "6a4bc6f1abd40a48106bff1f": { parentName: "Home & Kitchen", itemName: "Appliances" },
    "6a4bc6f1abd40a48106bff20": { parentName: "Electronics", itemName: "Mobiles" },
    "6a4bc6f1abd40a48106bff21": { parentName: "Electronics", itemName: "Laptops" },
    "6a4bc6f1abd40a48106bff22": { parentName: "Electronics", itemName: "Audio" },
    "6a4bc6f1abd40a48106bff23": { parentName: "Electronics", itemName: "Cameras" },
    "6a4bc6f1abd40a48106bff24": { parentName: "Kids", itemName: "Boys Clothing" },
    "6a4bc6f1abd40a48106bff25": { parentName: "Kids", itemName: "Girls Clothing" },
    "6a4bc6f1abd40a48106bff26": { parentName: "Kids", itemName: "Toys" },
    "6a4bc6f1abd40a48106bff27": { parentName: "Kids", itemName: "School Supplies" },
    "6a4e6fb51de8db2c40cadd36": { parentName: "Footwear", itemName: "Men's Footwear" },
    "6a4e709f1de8db2c40cadd37": { parentName: "Footwear", itemName: "Women's Footwear" },
    "6a53d712f39be3b4caa1df7d": { parentName: "Home Furnishing", itemName: "Living Room Furniture" },
    "6a53d798f39be3b4caa1df7f": { parentName: "Home Furnishing", itemName: "Bedroom Furniture" },
    "6a4b1677c3d0a8c51032e8b1": { parentName: "", itemName: "Men" },
    "6a4b1677c3d0a8c51032e8b4": { parentName: "", itemName: "Home & Kitchen" },
    "6a4b1677c3d0a8c51032e8b5": { parentName: "", itemName: "Watches" },
    "6a4b1677c3d0a8c51032e8b9": { parentName: "", itemName: "Beauty & Personal Care" },
    "6a2b152080a556e2cee09a1e": { parentName: "Men", itemName: "Casual Wear" },
};

const rootFallbackSubcategory = {
    Men: "Casual Wear",
    "Home & Kitchen": "Cookware",
};

const normalizeKey = (parentName = "", itemName = "") =>
    `${String(parentName).trim().toLowerCase()}::${String(itemName).trim().toLowerCase()}`;

const ensureCategories = async () => {
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

    let createdSubcategories = 0;

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
                createdSubcategories += 1;
            }
        }
    }

    return { insertedRoots: newCategories.length, createdSubcategories, rootCount: rootCategories.length };
};

const buildCategoryLookup = async () => {
    const categories = await Categories.find().lean();
    const byId = new Map(categories.map((entry) => [String(entry._id), entry]));
    const byKey = new Map();

    for (const category of categories) {
        const parent = category.parentCategoryId
            ? byId.get(String(category.parentCategoryId))
            : null;
        const parentName = parent?.itemName || "";
        byKey.set(normalizeKey(parentName, category.itemName), category._id);
        byKey.set(normalizeKey("", category.itemName), category._id);
    }

    return { byId, byKey };
};

const resolveTargetCategoryId = ({ parentName, itemName }, lookup) => {
    const directMatch = lookup.byKey.get(normalizeKey(parentName, itemName));

    if (directMatch) {
        return directMatch;
    }

    if (!parentName && rootFallbackSubcategory[itemName]) {
        const fallbackMatch = lookup.byKey.get(
            normalizeKey(itemName, rootFallbackSubcategory[itemName])
        );

        if (fallbackMatch) {
            return fallbackMatch;
        }
    }

    if (!parentName) {
        return lookup.byKey.get(normalizeKey("", itemName)) || null;
    }

    return null;
};

const resolveLegacyReference = (legacyId, lookup) => {
    const existing = lookup.byId.get(legacyId);

    if (existing) {
        const parent = existing.parentCategoryId
            ? lookup.byId.get(String(existing.parentCategoryId))
            : null;

        return {
            parentName: parent?.itemName || "",
            itemName: existing.itemName,
        };
    }

    return legacySubcategoryRefs[legacyId] || null;
};

const relinkProducts = async (lookup) => {
    const products = await Product.find().select("_id name subcategory_id").lean();

    let updated = 0;
    let skipped = 0;
    let unresolved = 0;

    for (const product of products) {
        const currentId = String(product.subcategory_id);

        if (lookup.byId.has(currentId)) {
            skipped += 1;
            continue;
        }

        const legacyRef = resolveLegacyReference(currentId, lookup);

        if (!legacyRef) {
            unresolved += 1;
            console.warn(`Unable to resolve subcategory for product ${product._id} (${product.name})`);
            continue;
        }

        const targetId = resolveTargetCategoryId(legacyRef, lookup);

        if (!targetId) {
            unresolved += 1;
            console.warn(
                `No target category for product ${product._id} (${product.name}) -> ${legacyRef.parentName}/${legacyRef.itemName}`
            );
            continue;
        }

        await Product.updateOne({ _id: product._id }, { $set: { subcategory_id: targetId } });
        updated += 1;
    }

    return { totalProducts: products.length, updated, skipped, unresolved };
};

const seedCategories = async () => {
    await connectDB();

    const categoryResult = await ensureCategories();
    const lookup = await buildCategoryLookup();
    const productResult = await relinkProducts(lookup);

    console.log(
        JSON.stringify(
            {
                ...categoryResult,
                products: productResult,
            },
            null,
            2
        )
    );

    await mongoose.connection.close();
};

seedCategories().catch(async (error) => {
    console.error(error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
});
