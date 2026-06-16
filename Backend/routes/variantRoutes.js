const express = require('express');
const router = express.Router();

const variantController = require("../controllers/variantController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

router.post("/",authUser,authRole("vendor"),variantController.createVariant);
router.get("/",authUser,authRole("vendor"),variantController.getVariant);
router.get("/:id",authUser,authRole("vendor"),variantController.getVariantById);
router.put("/:id",authUser,authRole("vendor"),variantController.putVariant);
router.delete("/:id",authUser,authRole("vendor"),variantController.deleteVariant);

module.exports = router;
