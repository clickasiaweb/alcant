const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllerDemo");

// Dashboard - No auth required for demo
router.get("/dashboard-summary", adminController.getDashboardSummary);

// Products - No auth required for demo
router.get("/products", adminController.getAdminProducts);
router.patch("/product/status/:id", adminController.updateProductStatus);

// Categories - No auth required for demo
router.get("/categories", adminController.getAdminCategories);
router.post("/categories", adminController.createAdminCategory);
router.put("/categories/:id", adminController.updateAdminCategory);
router.delete("/categories/:id", adminController.deleteCategory);

module.exports = router;
