require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../Modules/Users");
const Vendor = require("../Modules/Vendor");
const Product = require("../Modules/Product");

const SAMPLE_VENDOR_EMAIL = process.env.SAMPLE_VENDOR_EMAIL || "vendertest@gmail.com";

const assignProductsToSampleVendor = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/apnamart_db");

    const vendorUser = await User.findOne({ email: SAMPLE_VENDOR_EMAIL.toLowerCase() });

    if (!vendorUser) {
        throw new Error(`Sample vendor user not found: ${SAMPLE_VENDOR_EMAIL}`);
    }

    if (vendorUser.role !== "vendor") {
        vendorUser.role = "vendor";
        await vendorUser.save();
        console.log(`Updated ${SAMPLE_VENDOR_EMAIL} role to vendor`);
    }

    let vendorProfile = await Vendor.findOne({ userId: vendorUser._id });

    if (!vendorProfile) {
        vendorProfile = await Vendor.create({
            userId: vendorUser._id,
            businessName: "ApnaMart Sample Seller",
            businessAddress: "Sample Business Address, New Delhi, 110001",
            contactNumber: "9876543210",
        });
        console.log(`Created vendor profile for ${SAMPLE_VENDOR_EMAIL}`);
    }

    const result = await Product.updateMany(
        {},
        { $set: { vendor_id: vendorUser._id } }
    );

    const ownedCount = await Product.countDocuments({ vendor_id: vendorUser._id });

    console.log(`Assigned ${result.modifiedCount} products to ${SAMPLE_VENDOR_EMAIL}`);
    console.log(`Total products owned by sample vendor: ${ownedCount}`);
    console.log(`Vendor user id: ${vendorUser._id}`);

    await mongoose.disconnect();
};

assignProductsToSampleVendor()
    .then(() => {
        console.log("Done.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Failed:", error.message);
        process.exit(1);
    });
