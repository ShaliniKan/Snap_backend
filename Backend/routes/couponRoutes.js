const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.post("/validate", authUser, authRole("customer"), couponController.validateCouponCode);
router.get("/", authUser, authRole("admin"), couponController.listCoupons);
router.post("/", authUser, authRole("admin"), couponController.createCoupon);
router.put("/:couponId", authUser, authRole("admin"), couponController.updateCoupon);
router.delete("/:couponId", authUser, authRole("admin"), couponController.deleteCoupon);

module.exports = router;
