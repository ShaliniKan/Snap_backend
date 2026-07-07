//imports
const express = require('express');
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const {authUser} = require("../Middleware/auth");
const {authRole} = require("../Middleware/authRole");

//routes

router.get("/",categoriesController.getAllCategories);
router.get("/:id",categoriesController.getCategoryWithChildren);
router.get("/:id/subcategories",categoriesController.getSubCategories);
router.post("/", authUser, authRole("vendor"), categoriesController.createCategory);
router.post("/:id", authUser, authRole("vendor"), categoriesController.createSubcategory);
router.put("/:id", authUser, authRole("vendor"), categoriesController.putCategory);
router.put("/subcategories/:id", authUser, authRole("vendor"), categoriesController.putSubcategory);
router.delete("/:id", authUser, authRole("vendor"), categoriesController.deleteCategory);
router.delete("/subcategories/:id", authUser, authRole("vendor"), categoriesController.deleteSubcategory);

module.exports = router;
