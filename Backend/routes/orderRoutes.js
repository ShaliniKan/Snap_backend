//imports
const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//router
router.post("/", authUser, authRole, orderController.createOrder);
router.get("/",authUser,authRole, orderController.getMyOrders);
router.get("/:orderId", authUser, authRole, orderController.getOrderById);
router.put("/:orderId/cancel", authUser,authRole, orderController.cancelOrder);

module.exports = router;