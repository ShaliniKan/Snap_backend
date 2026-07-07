const express = require('express');

const router = express.Router();

const productController = require("../controllers/productController");

const {authUser} = require("../Middleware/auth");

const {authRole} = require("../Middleware/authRole");

const { requireApprovedVendor } = require("../Middleware/requireApprovedVendor");

const upload = require("../Middleware/upload");



router.get("/vendor/me", authUser, authRole("vendor"), requireApprovedVendor, productController.getVendorProducts);

router.post("/", authUser, authRole("vendor"), requireApprovedVendor, upload.single("image"), productController.createProduct);

router.get("/", productController.getAllProduct);

router.get("/:id", productController.getProductByID);

router.put("/:id", authUser, authRole("vendor"), requireApprovedVendor, upload.single("image"), productController.putProduct);

router.delete("/:id", authUser, authRole("vendor"), requireApprovedVendor, productController.deleteProduct);



module.exports = router;

