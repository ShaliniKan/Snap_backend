//imports
const express = require('express');
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//routes

router.get("/",categoriesController.getAllCategories);
router.get("/:id",categoriesController.getSubCategories);
router.post("/",authUser,authRole("admin,vendor"),categoriesController.createCategory);
router.post("/:id",authUser,authRole("admin,vendor"),categoriesController.createSubcategory);
router.put("/",authUser,authRole("admin,vendor"),categoriesController.putCategory);
router.put("/:id",authUser,authRole("admin,vendor"),categoriesController.putSubcategory);
router.delete("/",authUser,authRole("admin,vendor"),categoriesController.deleteCategory);
router.delete("/:id",authUser,authRole("admin,vendor"),categoriesController.deleteSubcategory);

module.exports = router;