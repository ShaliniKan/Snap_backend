const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.get("/product/:productId", reviewController.getProductReviews);
router.post("/product/:productId", authUser, authRole("customer"), reviewController.createReview);

module.exports = router;
