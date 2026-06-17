const express = require('express');
const router = express.Router();

const variantController = require("../controllers/variantController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

router.post("/",authUser,authRole("vendor"),variantController.createVariants);
router.get("/",authUser,authRole("vendor,customer"),variantController.getVariants);
router.get("/:id",authUser,authRole("vendor,customer"),variantController.getVariantsById);
router.put("/:id",authUser,authRole("vendor"),variantController.putVariants);
router.delete("/:id",authUser,authRole("vendor"),variantController.deleteVariants);

module.exports = router;
