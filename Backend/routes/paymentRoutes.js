const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.post("/create-order", authUser, authRole("customer"), paymentController.createPaymentOrder);
router.post("/verify", authUser, authRole("customer"), paymentController.verifyPayment);

module.exports = router;
