const mongo = require("mongoose");
const connectDB = async() => {
    try{
        await mongo.connect("mongodb://127.0.0.1:27017/apnamart_db");
        console.log("Connection is established");
    } catch(error){
        console.error("Connction failed: ", error.message);
        process.exit(1);
    }

};

module.exports = connectDB;