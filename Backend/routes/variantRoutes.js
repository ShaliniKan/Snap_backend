const express = require('express');
const router = express.Router();

const variantController = require("../controllers/variantController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

router.post("/",authUser,authRole("vendor"),variantController.createVariant);

module.exports = router;
