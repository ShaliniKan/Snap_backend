const express = require('express');
const router = express.Router({ mergeParams: true });

const variantController = require("../controllers/variantController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");
const { requireApprovedVendor } = require("../Middleware/requireApprovedVendor");

router.get("/", variantController.getVariants);
router.get("/:id", variantController.getVariantsById);
router.post("/", authUser, authRole("vendor"), requireApprovedVendor, variantController.createVariants);
router.put("/:id", authUser, authRole("vendor"), requireApprovedVendor, variantController.putVariants);
router.delete("/:id", authUser, authRole("vendor"), requireApprovedVendor, variantController.deleteVariants);

module.exports = router;
