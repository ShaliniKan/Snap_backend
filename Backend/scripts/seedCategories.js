require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const Categories = require("../Modules/Categories");
const Product = require("../Modules/Product");
const User = require("../Modules/Users");
const { normalizeImagePath } = require("../utils/productHelpers");

const SAMPLE_VENDOR_EMAIL = process.env.SAMPLE_VENDOR_EMAIL || "vendertest@gmail.com";
const UPLOAD_DIR = path.join(__dirname, "../uploads/products");

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
    "Beauty & Personal Care": ["Beauty", "Personal Care"],
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

    return { byId };
};

const buildCanonicalLookup = async () => {
    const byKey = new Map();

    for (const rootName of categoryNames) {
        const rootCategories = await Categories.find({ itemName: rootName, parentCategoryId: null })
            .sort({ createdAt: -1 })
            .lean();

        if (rootCategories.length === 0) {
            continue;
        }

        const canonicalRoot = rootCategories[0];
        byKey.set(normalizeKey("", rootName), canonicalRoot._id);

        for (const childName of subcategoryMap[rootName] || []) {
            let subcategory = await Categories.findOne({
                itemName: childName,
                parentCategoryId: canonicalRoot._id,
            }).lean();

            if (!subcategory) {
                for (const rootCategory of rootCategories.slice(1)) {
                    subcategory = await Categories.findOne({
                        itemName: childName,
                        parentCategoryId: rootCategory._id,
                    }).lean();

                    if (subcategory) {
                        break;
                    }
                }
            }

            if (subcategory) {
                byKey.set(normalizeKey(rootName, childName), subcategory._id);
            }
        }

        const canonicalSubcategories = await Categories.find({
            parentCategoryId: canonicalRoot._id,
        }).lean();

        for (const subcategory of canonicalSubcategories) {
            byKey.set(normalizeKey(rootName, subcategory.itemName), subcategory._id);
        }
    }

    return { byKey };
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

    if (parentName) {
        return lookup.byKey.get(normalizeKey("", parentName)) || null;
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

const relinkProducts = async ({ allById, canonicalByKey }) => {
    const products = await Product.find().select("_id name subcategory_id").lean();

    let updated = 0;
    let skipped = 0;
    let unresolved = 0;

    for (const product of products) {
        const currentId = String(product.subcategory_id);
        const legacyRef = resolveLegacyReference(currentId, { byId: allById });

        if (!legacyRef) {
            unresolved += 1;
            console.warn(`Unable to resolve subcategory for product ${product._id} (${product.name})`);
            continue;
        }

        const targetId = resolveTargetCategoryId(legacyRef, { byKey: canonicalByKey });

        if (!targetId) {
            unresolved += 1;
            console.warn(
                `No target category for product ${product._id} (${product.name}) -> ${legacyRef.parentName}/${legacyRef.itemName}`
            );
            continue;
        }

        if (String(targetId) === currentId) {
            skipped += 1;
            continue;
        }

        await Product.updateOne({ _id: product._id }, { $set: { subcategory_id: targetId } });
        updated += 1;
    }

    return { totalProducts: products.length, updated, skipped, unresolved };
};

const assignVendorProducts = async () => {
    const vendorUser = await User.findOne({ email: SAMPLE_VENDOR_EMAIL.toLowerCase() });

    if (!vendorUser) {
        throw new Error(`Vendor user not found: ${SAMPLE_VENDOR_EMAIL}`);
    }

    if (vendorUser.role !== "vendor") {
        vendorUser.role = "vendor";
        await vendorUser.save();
    }

    const result = await Product.updateMany({}, { $set: { vendor_id: vendorUser._id } });

    return {
        email: SAMPLE_VENDOR_EMAIL,
        vendorId: String(vendorUser._id),
        assigned: result.modifiedCount,
        totalOwned: await Product.countDocuments({ vendor_id: vendorUser._id }),
    };
};

const imageExistsOnDisk = (imagePath) => {
    if (!imagePath) {
        return false;
    }

    const relativePath = String(imagePath).replace(/^\/+/, "");
    return fs.existsSync(path.join(__dirname, "..", relativePath));
};

const normalizeImageKey = (value = "") =>
    value.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "");

const keywordHints = [
    ["oxford", ["oxford"]],
    ["casualshirt", ["casual", "shirt"]],
    ["linenfullshirt", ["linen", "sleeve", "shirt"]],
    ["bluejeans", ["blue", "jeans"]],
    ["blackjeans", ["black", "jeans"]],
    ["jeans", ["jeans"]],
    ["tshirt", ["tshirt", "shirt"]],
    ["crewtshirt", ["crew", "shirt"]],
    ["graphictshirt", ["graphic", "shirt"]],
    ["straightkurti", ["straight", "kurti"]],
    ["anarkalikurti", ["anarkali", "kurti"]],
    ["officekurti", ["office", "kurti"]],
    ["maxidress", ["maxi", "dress"]],
    ["alinedress", ["line", "dress"]],
    ["bodycondress", ["bodycon", "dress"]],
    ["banarasisaree", ["banarasi", "saree"]],
    ["georgettesaree", ["georgette", "saree"]],
    ["cottonsaree", ["cotton", "saree"]],
];

const scoreProductForFile = (productName, fileName) => {
    const productKey = normalizeImageKey(productName);
    const fileKey = normalizeImageKey(fileName);

    if (!productKey || !fileKey) {
        return 0;
    }

    if (productKey.includes(fileKey) || fileKey.includes(productKey)) {
        return 200;
    }

    let score = 0;
    const fileHint = keywordHints.find(([hintKey]) => fileKey.includes(hintKey));

    if (fileHint) {
        const [, requiredTokens] = fileHint;
        const matchedTokens = requiredTokens.filter((token) => productKey.includes(token));
        score += matchedTokens.length * 40;

        if (matchedTokens.length === requiredTokens.length) {
            score += 60;
        }
    }

    const words = productName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2);

    words.forEach((word) => {
        if (fileKey.includes(word)) {
            score += word.length * 2;
        }
    });

    return score;
};

const findBestFileForProduct = (productName, files, usedFiles) => {
    const rankedFiles = files
        .map((file) => ({
            file,
            score: scoreProductForFile(productName, file),
        }))
        .filter((entry) => entry.score >= 20)
        .sort((left, right) => right.score - left.score);

    return rankedFiles.find((entry) => !usedFiles.has(entry.file)) || null;
};

const restoreProductImages = async () => {
    if (!fs.existsSync(UPLOAD_DIR)) {
        return { updated: 0, skipped: 0, missingUploadDir: true };
    }

    const files = fs
        .readdirSync(UPLOAD_DIR)
        .filter((file) => /\.(jpe?g|png|webp|gif|avif)$/i.test(file));
    const products = await Product.find().select("name images").lean();
    const usedFiles = new Set();
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
        const validExisting = [...new Set(
            (product.images || [])
                .map((entry) => normalizeImagePath(entry))
                .filter((entry) => entry && imageExistsOnDisk(entry))
        )];

        let nextImages = validExisting;

        if (nextImages.length === 0) {
            const match = findBestFileForProduct(product.name, files, usedFiles);

            if (match) {
                nextImages = [normalizeImagePath(`uploads/products/${match.file}`)];
                usedFiles.add(match.file);
            } else {
                nextImages = ["/banner1.jpg"];
            }
        }

        const currentImages = (product.images || []).map((entry) => normalizeImagePath(entry)).filter(Boolean);
        const imagesChanged =
            nextImages.length !== currentImages.length ||
            nextImages.some((entry, index) => entry !== currentImages[index]);

        if (!imagesChanged) {
            skipped += 1;
            continue;
        }

        await Product.updateOne({ _id: product._id }, { $set: { images: nextImages } });
        updated += 1;
    }

    return { updated, skipped, totalProducts: products.length };
};

const seedCategories = async () => {
    await connectDB();

    const categoryResult = await ensureCategories();
    const { byId: allById } = await buildCategoryLookup();
    const { byKey: canonicalByKey } = await buildCanonicalLookup();
    const vendorResult = await assignVendorProducts();
    const productResult = await relinkProducts({ allById, canonicalByKey });
    const imageResult = await restoreProductImages();

    console.log(
        JSON.stringify(
            {
                ...categoryResult,
                vendor: vendorResult,
                products: productResult,
                images: imageResult,
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
