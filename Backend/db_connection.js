const mongo = require("mongoose");

const connectDB = async () => {
    try {
        const uri =
            process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/apnamart_db";
        await mongo.connect(uri);
        console.log("Connection is established");
    } catch (error) {
        console.error("Connction failed: ", error);
        process.exit(1);
    }
};

module.exports = connectDB;