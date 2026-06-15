const express = require('express');
const router = express.Router();

const vendorController = require("../controllers/vendorController");

router.post('/', vendorController.createVendor);

module.exports = router;