const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.get("/dashboard", authUser, authRole("admin"), adminController.getAdminDashboard);
router.get("/orders", authUser, authRole("admin"), adminController.getAdminOrders);
router.put("/orders/:orderId/status", authUser, authRole("admin"), adminController.updateAdminOrderStatus);

module.exports = router;
