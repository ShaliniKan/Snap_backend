const express = require('express');

const router = express.Router();

const productController = require("../controllers/productController");

const {authUser} = require("../Middleware/auth");

const {authRole} = require("../Middleware/authRole");

const upload = require("../Middleware/upload");

const handleUpload =
    (uploadMiddleware) =>
    (req, res, next) => {
        uploadMiddleware(req, res, (error) => {
            if (!error) {
                return next();
            }

            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "Each image must be smaller than 5MB",
                });
            }

            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    success: false,
                    message: "Too many images uploaded",
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message || "Image upload failed",
            });
        });
    };

router.get("/vendor/me", authUser, authRole("vendor"), productController.getVendorProducts);

router.post("/", authUser, authRole("vendor"), handleUpload(upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 6 },
])), productController.createProduct);

router.get("/", productController.getAllProduct);

router.get("/:id", productController.getProductByID);

router.put("/:id", authUser, authRole("vendor"), handleUpload(upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 6 },
])), productController.putProduct);

router.delete("/:id", authUser, authRole("vendor"), productController.deleteProduct);



module.exports = router;

