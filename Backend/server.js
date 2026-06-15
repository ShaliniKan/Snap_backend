require("dotenv").config();
const express = require("express");
const connectDB = require("./db_connection");

//import routes
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const variantRoutes = require("./routes/variantRoutes");

//start
const app = express();
connectDB();

app.use(express.json());

//Api routes
app.use("/api/users", userRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/product", productRoutes);
app.use("/api/product_variant", variantRoutes);



app.listen(5000,() => {
    console.log("Server running");
});
