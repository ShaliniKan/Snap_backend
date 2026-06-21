//imports
const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//router
router.post("/", authUser, authRole, createOrder);
router.get("/",authUser,authRole, getMyOrders);
router.get("/:orderId", authUser, authRole, getOrderById);
router.put("/:orderId/cancel", authUser,authRole, cancelOrder);

module.exports = router;