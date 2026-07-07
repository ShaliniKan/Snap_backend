require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db_connection");
const DeliveryZone = require("../Modules/DeliveryZone");

const zones = [
    { pincode: "110001", city: "New Delhi", state: "Delhi", deliveryCharge: 0, estimatedDays: 3 },
    { pincode: "110002", city: "New Delhi", state: "Delhi", deliveryCharge: 0, estimatedDays: 3 },
    { pincode: "400001", city: "Mumbai", state: "Maharashtra", deliveryCharge: 49, estimatedDays: 4 },
    { pincode: "560001", city: "Bengaluru", state: "Karnataka", deliveryCharge: 49, estimatedDays: 4 },
    { pincode: "700001", city: "Kolkata", state: "West Bengal", deliveryCharge: 59, estimatedDays: 5 },
    { pincode: "600001", city: "Chennai", state: "Tamil Nadu", deliveryCharge: 59, estimatedDays: 5 },
];

const seedDeliveryZones = async () => {
    connectDB();

    for (const zone of zones) {
        await DeliveryZone.findOneAndUpdate({ pincode: zone.pincode }, zone, { upsert: true, new: true });
    }

    console.log(`Seeded ${zones.length} delivery zones`);
    await mongoose.connection.close();
};

seedDeliveryZones().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
