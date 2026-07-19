require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const Product = require("../Modules/Product");
const { normalizeImagePath } = require("../utils/productHelpers");

const UPLOAD_DIR = path.join(__dirname, "../uploads/products");

const normalizeKey = (value = "") =>
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
    const productKey = normalizeKey(productName);
    const fileKey = normalizeKey(fileName);

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

    const words = productName.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 2);
    words.forEach((word) => {
        if (fileKey.includes(word)) {
            score += word.length * 2;
        }
    });

    return score;
};

const assignProductImages = async () => {
    connectDB();

    if (!fs.existsSync(UPLOAD_DIR)) {
        throw new Error(`Upload directory not found: ${UPLOAD_DIR}`);
    }

    const files = fs.readdirSync(UPLOAD_DIR).filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file));
    const products = await Product.find().select("name images").lean();
    const usedProducts = new Set();
    let updated = 0;

    for (const file of files) {
        const rankedProducts = products
            .map((product) => ({
                product,
                score: scoreProductForFile(product.name, file),
            }))
            .filter((entry) => entry.score > 0)
            .sort((left, right) => right.score - left.score);

        const match = rankedProducts.find((entry) => !usedProducts.has(String(entry.product._id))) || rankedProducts[0];

        if (!match || match.score < 20) {
            console.log(`Skipped ${file} — no confident product match`);
            continue;
        }

        const imagePath = normalizeImagePath(`uploads/products/${file}`);
        await Product.updateOne(
            { _id: match.product._id },
            { $set: { images: [imagePath] } }
        );

        usedProducts.add(String(match.product._id));
        updated += 1;
        console.log(`Assigned ${file} -> ${match.product.name} (${match.score})`);
    }

    const emptyImageProducts = await Product.find({
        $or: [{ images: { $exists: false } }, { images: { $size: 0 } }, { images: "" }, { images: [""] }],
    }).select("_id name");

    for (const product of emptyImageProducts) {
        await Product.updateOne(
            { _id: product._id },
            { $set: { images: ["/banner1.jpg"] } }
        );
    }

    console.log(`Updated ${updated} products with upload images`);
    console.log(`Set fallback image for ${emptyImageProducts.length} products without images`);
    await mongoose.connection.close();
};

assignProductImages().catch(async (error) => {
    console.error(error.message);
    await mongoose.connection.close();
    process.exit(1);
});
