const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");
const { requireApprovedVendor } = require("../Middleware/requireApprovedVendor");

router.get("/profile", authUser, authRole("vendor"), vendorController.getProfile);
router.post("/profile", authUser, authRole("vendor"), vendorController.createProfile);
router.put("/profile", authUser, authRole("vendor"), vendorController.updateProfile);
router.get("/dashboard", authUser, authRole("vendor"), requireApprovedVendor, vendorController.getDashboardStats);

router.get("/admin/pending", authUser, authRole("admin"), vendorController.listPendingVendors);
router.put("/admin/:vendorUserId/approve", authUser, authRole("admin"), vendorController.approveVendor);
router.put("/admin/:vendorUserId/reject", authUser, authRole("admin"), vendorController.rejectVendor);

module.exports = router;
