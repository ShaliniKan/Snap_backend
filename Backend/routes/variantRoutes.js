const express = require('express');
const router = express.Router();

const variantController = require("../controllers/variantController");

router.post("/",variantController.createVariant);

module.exports = router;
