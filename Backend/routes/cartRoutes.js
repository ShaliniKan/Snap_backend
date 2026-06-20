//imports
const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//routes
router.post("/add", authUser, authRole, cartController.addToCart);

router.get("/", authUser, authRole, cartController.getCart);

router.put("/item/:itemId", authUser, authRole, cartController.updateCartItem);

router.delete("/item/:itemId", authUser, authRole, cartController.removeCartItem);

router.delete("/", authUser, authRole, cartController.clearCart);

module.exports = router;