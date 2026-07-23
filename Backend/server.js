require("dotenv").config();
const express = require("express");
const connectDB = require("./db_connection");

//import routes
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const variantRoutes = require("./routes/variantRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const couponRoutes = require("./routes/couponRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const returnRoutes = require("./routes/returnRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

//start
const app = express();

app.use(express.json());

//Api routes
app.use("/api/users", userRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/categories",categoriesRoutes);
app.use("/api/product", productRoutes);
app.use("/api/product/:productId", variantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/uploads", express.static("uploads"));

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "Each image must be smaller than 5MB",
        });
    }

    if (error?.message) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});

const startServer = async () => {
    await connectDB();

    app.listen(5000, () => {
        console.log("Server running");
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
