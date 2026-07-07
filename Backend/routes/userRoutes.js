const express = require("express");
const router = express.Router();

const {registerUser} = require("../controllers/userController");
const {loginUser} = require("../controllers/loginUser");
 

router.post("/register", registerUser);
router.post("/register/customer", registerUser);
router.post("/register/vendor", registerUser);
router.post("/login", loginUser);



module.exports = router;