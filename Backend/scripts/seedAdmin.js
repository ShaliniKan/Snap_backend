require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const User = require("../Modules/Users");

const seedAdmin = async () => {
    connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@apnamart.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@12345";
    const existing = await User.findOne({ email });

    if (existing) {
        existing.role = "admin";
        existing.approvalStatus = undefined;
        await existing.save();
        console.log(`Updated existing user ${email} to admin`);
    } else {
        await User.create({
            firstName: "ApnaMart",
            lastName: "Admin",
            email,
            password,
            role: "admin",
        });
        console.log(`Created admin user ${email}`);
    }

    await mongoose.connection.close();
};

seedAdmin().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
