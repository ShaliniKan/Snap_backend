const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.get("/profile", authUser, authRole("vendor"), vendorController.getProfile);
router.post("/profile", authUser, authRole("vendor"), vendorController.createProfile);
router.put("/profile", authUser, authRole("vendor"), vendorController.updateProfile);
router.get("/dashboard", authUser, authRole("vendor"), vendorController.getDashboardStats);

router.get("/platform/dashboard", authUser, authRole("vendor"), vendorController.getPlatformDashboard);
router.get("/platform/orders", authUser, authRole("vendor"), vendorController.getAllOrders);
router.put("/platform/orders/:orderId/status", authUser, authRole("vendor"), vendorController.updatePlatformOrderStatus);

module.exports = router;
