const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.get("/pincode/:pincode", deliveryController.validatePincode);
router.get("/", authUser, authRole("admin"), deliveryController.listDeliveryZones);
router.post("/", authUser, authRole("admin"), deliveryController.createDeliveryZone);

module.exports = router;
