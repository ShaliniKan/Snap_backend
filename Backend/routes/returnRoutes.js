const express = require("express");
const router = express.Router();
const returnController = require("../controllers/returnController");
const { authUser } = require("../Middleware/auth");
const { authRole } = require("../Middleware/authRole");

router.post("/order/:orderId", authUser, authRole("customer"), returnController.createReturnRequest);
router.get("/my", authUser, authRole("customer"), returnController.getMyReturns);
router.get("/", authUser, authRole("vendor"), returnController.listAllReturns);
router.put("/:returnId", authUser, authRole("vendor"), returnController.updateReturnStatus);

module.exports = router;
