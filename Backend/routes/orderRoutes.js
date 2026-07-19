const express = require('express');

const router = express.Router();

const orderController = require("../controllers/orderController");

const { authUser } = require("../Middleware/auth");

const { authRole } = require("../Middleware/authRole");



router.get("/vendor", authUser, authRole("vendor"), orderController.getVendorOrders);

router.put("/vendor/:orderId/status", authUser, authRole("vendor"), orderController.updateVendorOrderStatus);



router.post("/", authUser, authRole("customer"), orderController.createOrder);

router.get("/", authUser, authRole("customer"), orderController.getMyOrders);

router.get("/:orderId", authUser, authRole("customer"), orderController.getOrderById);

router.put("/:orderId/cancel", authUser, authRole("customer"), orderController.cancelOrder);



module.exports = router;

