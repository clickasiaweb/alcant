const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Dashboard
router.get(
  "/dashboard-summary",
  authMiddleware,
  adminMiddleware,
  adminController.getDashboardSummary
);

// Products
router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  adminController.getAdminProducts
);
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  adminController.createProduct
);
router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateProduct
);
router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteProduct
);
router.patch(
  "/product/status/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateProductStatus
);

// Categories
router.get(
  "/categories",
  authMiddleware,
  adminMiddleware,
  adminController.getAdminCategories
);
router.post(
  "/category",
  authMiddleware,
  adminMiddleware,
  adminController.createCategory
);
router.put(
  "/category/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateCategory
);
router.delete(
  "/category/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteCategory
);

// Content
router.get(
  "/content/:page",
  adminController.getContent
);
router.put(
  "/content/:page",
  authMiddleware,
  adminMiddleware,
  adminController.updateContent
);

module.exports = router;
