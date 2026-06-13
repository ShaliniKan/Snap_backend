const express = require("express");
const connectDB = require("./db_connection");

const userRoutes = require("./routes/userRoutes");

const app = express();
connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);



app.listen(5000,() => {
    console.log("Server running");
});
