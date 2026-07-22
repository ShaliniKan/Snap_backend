require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");

const uri = process.env.ATLAS_URI || process.env.MONGODB_URI;

if (!uri || uri.includes("127.0.0.1")) {
    console.error("Set ATLAS_URI in Backend/.env to your mongodb+srv:// connection string.");
    process.exit(1);
}

mongoose
    .connect(uri)
    .then(async () => {
        const categories = await mongoose.connection.db.collection("categories").countDocuments();
        const products = await mongoose.connection.db.collection("products").countDocuments();
        console.log("Atlas connection OK");
        console.log(`categories: ${categories}`);
        console.log(`products: ${products}`);
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch((err) => {
        console.error("Atlas connection failed:", err.message);
        process.exit(1);
    });
