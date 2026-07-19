const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.post("/validate", authUser, authRole("customer"), couponController.validateCouponCode);
router.get("/", authUser, authRole("vendor"), couponController.listCoupons);
router.post("/", authUser, authRole("vendor"), couponController.createCoupon);
router.put("/:couponId", authUser, authRole("vendor"), couponController.updateCoupon);
router.delete("/:couponId", authUser, authRole("vendor"), couponController.deleteCoupon);

module.exports = router;
