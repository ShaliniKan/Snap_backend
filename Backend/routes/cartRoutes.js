const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.post("/add", authUser, authRole("customer"), cartController.addToCart);
router.get("/", authUser, authRole("customer"), cartController.getCart);
router.put("/item/:itemId", authUser, authRole("customer"), cartController.updateCartItem);
router.delete("/item/:itemId", authUser, authRole("customer"), cartController.removeCartItem);
router.delete("/", authUser, authRole("customer"), cartController.clearCart);

module.exports = router;
