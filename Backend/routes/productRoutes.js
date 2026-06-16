//imports
const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//routes

router.post("/",authUser,authRole("vendor"),productController.createProduct);

module.exports = router;
