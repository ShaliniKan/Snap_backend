require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const Coupon = require("../Modules/Coupon");

const coupons = [
    {
        code: "WELCOME10",
        description: "10% off on your first order",
        discountType: "percent",
        discountValue: 10,
        minOrderAmount: 499,
        maxDiscount: 200,
    },
    {
        code: "SAVE100",
        description: "Flat ₹100 off",
        discountType: "flat",
        discountValue: 100,
        minOrderAmount: 999,
    },
    {
        code: "FLASH25",
        description: "Flash deal 25% off",
        discountType: "percent",
        discountValue: 25,
        minOrderAmount: 1499,
        maxDiscount: 500,
    },
];

const seedCoupons = async () => {
    connectDB();

    for (const coupon of coupons) {
        await Coupon.findOneAndUpdate({ code: coupon.code }, coupon, { upsert: true, new: true });
    }

    console.log(`Seeded ${coupons.length} coupons`);
    await mongoose.connection.close();
};

seedCoupons().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
