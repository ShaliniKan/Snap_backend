const express = require("express");

const router = express.Router({ mergeParams: true });

const variantController = require("../controllers/variantController");

const { authUser } = require("../Middleware/auth");

const { authRole } = require("../Middleware/authRole");

const uploadVariant = require("../Middleware/uploadVariant");

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

            return res.status(400).json({
                success: false,
                message: error.message || "Image upload failed",
            });
        });
    };

router.get("/", variantController.getVariants);

router.get("/:id", variantController.getVariantsById);

router.post("/", authUser, authRole("vendor"), handleUpload(uploadVariant.single("image")), variantController.createVariants);

router.put("/:id", authUser, authRole("vendor"), handleUpload(uploadVariant.single("image")), variantController.putVariants);

router.delete("/:id", authUser, authRole("vendor"), variantController.deleteVariants);

module.exports = router;
