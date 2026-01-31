const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Public routes
router.get("/", productController.getProducts);
router.get("/recommended", productController.getRecommendedProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new", productController.getNewProducts);
router.get("/sale", productController.getSaleProducts);
router.get("/limited-edition", productController.getLimitedEditionProducts);
router.get("/categories", productController.getCategories);
router.get("/search", productController.searchProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/slug/:slug", productController.getProductBySlug);

// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);
router.patch(
  "/:id/archive",
  authMiddleware,
  adminMiddleware,
  productController.archiveProduct
);

module.exports = router;
