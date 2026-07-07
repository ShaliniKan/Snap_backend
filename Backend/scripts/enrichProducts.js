require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const Product = require("../Modules/Product");
const Variant = require("../Modules/Product_Variant");

const imagePool = ["/banner1.jpg", "/banner2.jpg", "/men.jpg", "/women.jpg"];

const pickImage = (index) => imagePool[index % imagePool.length];

const buildPrice = (index) => {
    const base = 499 + (index % 20) * 250;
    const discountPrice = Math.round(base * (0.75 + (index % 5) * 0.03));
    const discount = Math.round(((base - discountPrice) / base) * 100);

    return { price: base, discount_price: discountPrice, discount };
};

const enrichProducts = async () => {
    connectDB();

    const products = await Product.find();
    let updatedProducts = 0;

    for (let index = 0; index < products.length; index += 1) {
        const product = products[index];
        const pricing = buildPrice(index);
        let changed = false;

        if (!product.price || product.price <= 0) {
            product.price = pricing.price;
            changed = true;
        }

        if (!product.discount_price || product.discount_price <= 0) {
            product.discount_price = pricing.discount_price;
            changed = true;
        }

        if (!product.discount || product.discount <= 0) {
            product.discount = pricing.discount;
            changed = true;
        }

        if (!product.brand) {
            product.brand = "ApnaMart";
            changed = true;
        }

        if (!product.description) {
            product.description = `${product.name} — premium quality product available on ApnaMart with fast delivery and easy returns.`;
            changed = true;
        }

        if (!product.rating || product.rating <= 0) {
            product.rating = 3.8 + (index % 12) * 0.1;
            changed = true;
        }

        if (!product.ratingCount || product.ratingCount <= 0) {
            product.ratingCount = 20 + (index % 180);
            changed = true;
        }

        if (!product.quantity || product.quantity <= 0) {
            product.quantity = 25;
            changed = true;
        }

        if (!product.status || product.status === "out_of_stock") {
            product.status = "active";
            changed = true;
        }

        if (!Array.isArray(product.images) || product.images.length === 0) {
            product.images = [pickImage(index)];
            changed = true;
        }

        if (changed) {
            await product.save();
            updatedProducts += 1;
        }

        const variants = await Variant.find({ product_id: product._id });

        for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
            const variant = variants[variantIndex];
            const variantPricing = buildPrice(index + variantIndex + 1);
            let variantChanged = false;

            if (!variant.price || variant.price <= 0) {
                variant.price = variantPricing.price;
                variantChanged = true;
            }

            if (!variant.discount_price || variant.discount_price <= 0) {
                variant.discount_price = variantPricing.discount_price;
                variantChanged = true;
            }

            if (!variant.stock_quantity || variant.stock_quantity <= 0) {
                variant.stock_quantity = 25;
                variantChanged = true;
            }

            if (variantChanged) {
                await variant.save();
            }
        }
    }

    console.log(`Enriched ${updatedProducts} of ${products.length} products`);
    await mongoose.connection.close();
};

enrichProducts().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
