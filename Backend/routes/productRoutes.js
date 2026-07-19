const express = require('express');

const router = express.Router();

const productController = require("../controllers/productController");

const {authUser} = require("../Middleware/auth");

const {authRole} = require("../Middleware/authRole");

const upload = require("../Middleware/upload");



router.get("/vendor/me", authUser, authRole("vendor"), productController.getVendorProducts);

router.post("/", authUser, authRole("vendor"), upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 6 },
]), productController.createProduct);

router.get("/", productController.getAllProduct);

router.get("/:id", productController.getProductByID);

router.put("/:id", authUser, authRole("vendor"), upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 6 },
]), productController.putProduct);

router.delete("/:id", authUser, authRole("vendor"), productController.deleteProduct);



module.exports = router;

