require("dotenv").config();
const connectDB = require("../db_connection");
const Product = require("../Modules/Product");

const ensureProductStock = async () => {
    connectDB();

    const result = await Product.updateMany(
        { $or: [{ quantity: { $exists: false } }, { quantity: { $lte: 0 } }] },
        { $set: { quantity: 25, status: "active" } }
    );

    console.log(`Updated ${result.modifiedCount} product(s) with default stock.`);
    process.exit(0);
};

ensureProductStock().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
