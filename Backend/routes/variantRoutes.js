const express = require("express");

const router = express.Router({ mergeParams: true });

const variantController = require("../controllers/variantController");

const { authUser } = require("../Middleware/auth");

const { authRole } = require("../Middleware/authRole");

const uploadVariant = require("../Middleware/uploadVariant");

router.get("/", variantController.getVariants);

router.get("/:id", variantController.getVariantsById);

router.post("/", authUser, authRole("vendor"), uploadVariant.single("image"), variantController.createVariants);

router.put("/:id", authUser, authRole("vendor"), uploadVariant.single("image"), variantController.putVariants);

router.delete("/:id", authUser, authRole("vendor"), variantController.deleteVariants);

module.exports = router;
