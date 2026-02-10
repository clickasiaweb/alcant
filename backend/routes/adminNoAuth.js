const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard - No auth for testing
router.get("/dashboard-summary", adminController.getDashboardSummary);

// Products - No auth for testing
router.get("/products", adminController.getAdminProducts);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.patch("/product/status/:id", adminController.updateProductStatus);

// Categories - No auth for testing
router.get("/categories", adminController.getAdminCategories);
router.get("/subcategories", adminController.getSubCategories);
router.get("/sub-subcategories", adminController.getSubSubCategories);
router.post("/category", adminController.createCategory);
router.post("/subcategory", adminController.createSubCategory);
router.post("/sub-subcategory", adminController.createSubSubCategory);
router.put("/category/:id", adminController.updateCategory);
router.put("/subcategory/:id", adminController.updateSubCategory);
router.put("/sub-subcategory/:id", adminController.updateSubSubCategory);
router.delete("/category/:id", adminController.deleteCategory);
router.delete("/subcategory/:id", adminController.deleteSubCategory);
router.delete("/sub-subcategory/:id", adminController.deleteSubSubCategory);

// Content - No auth for testing
router.get("/content/:page", adminController.getContent);
router.put("/content/:page", adminController.updateContent);

module.exports = router;
