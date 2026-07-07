const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.get("/profile", authUser, authRole("customer"), customerController.getProfile);
router.put("/profile", authUser, authRole("customer"), customerController.updateProfile);
router.post("/addresses", authUser, authRole("customer"), customerController.addAddress);
router.put("/addresses/:addressId", authUser, authRole("customer"), customerController.updateAddress);
router.delete("/addresses/:addressId", authUser, authRole("customer"), customerController.deleteAddress);
router.put("/addresses/:addressId/default", authUser, authRole("customer"), customerController.setDefaultAddress);

module.exports = router;
