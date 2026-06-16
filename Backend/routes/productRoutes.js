//imports
const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//routes

router.post("/",authUser,authRole("vendor"),productController.createProduct);
router.get("/",authUser,productController.getAllProduct);
router.get("/:id",authUser,productController.getProductByID);
router.put("/:id",authUser,authRole("vendor"),productController.putProduct);
router.delete("/:id",authUser,authRole("vendor"),productController.deleteProduct);

module.exports = router;
