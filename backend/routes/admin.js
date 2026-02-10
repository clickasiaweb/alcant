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

// Categories - Updated for 3-level hierarchy
router.get(
  "/categories",
  authMiddleware,
  adminMiddleware,
  adminController.getAdminCategories
);
router.get(
  "/subcategories",
  authMiddleware,
  adminMiddleware,
  adminController.getSubCategories
);
router.post(
  "/category",
  authMiddleware,
  adminMiddleware,
  adminController.createCategory
);
router.post(
  "/subcategory",
  authMiddleware,
  adminMiddleware,
  adminController.createSubCategory
);
router.post(
  "/sub-subcategory",
  authMiddleware,
  adminMiddleware,
  adminController.createSubSubCategory
);
router.put(
  "/category/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateCategory
);
router.put(
  "/subcategory/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateSubCategory
);
router.put(
  "/sub-subcategory/:id",
  authMiddleware,
  adminMiddleware,
  adminController.updateSubSubCategory
);
router.delete(
  "/category/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteCategory
);
router.delete(
  "/subcategory/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteSubCategory
);
router.delete(
  "/sub-subcategory/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteSubSubCategory
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
