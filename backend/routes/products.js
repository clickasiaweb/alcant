const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const SupabaseProduct = require("../models/SupabaseProduct");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Temporary endpoint to add test product
router.post("/add-test-product", async (req, res) => {
  try {
    const testProduct = {
      name: "Test Product for Demo",
      slug: "test-product-demo",
      description: "This is a test product for demonstration purposes. It should display correctly on the product details page.",
      price: 99.99,
      old_price: 149.99,
      final_price: 99.99,
      category: "test-category",
      subcategory: "demo",
      images: ["https://picsum.photos/seed/test-product/400/400.jpg"],
      image: "https://picsum.photos/seed/test-product/400/400.jpg",
      rating: 4.5,
      reviews: 12,
      stock: 50,
      is_new: true,
      is_limited_edition: false,
      is_blue_monday_sale: false,
      is_active: true
    };
    
    const product = await SupabaseProduct.create(testProduct);
    console.log('Test product created:', product);
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error creating test product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint for product creation
router.get("/test-create", async (req, res) => {
  try {
    console.log('🧪 Test create endpoint called');
    
    const testProduct = {
      name: 'Test Product',
      category: 'Phone Cases',
      subcategory: 'iPhone Cases',
      sub_subcategory: '15 Pro Case',
      sub_sub_subcategory: 'Silicon Cases',
      price: 99.99,
      description: 'Test product for debugging'
    };
    
    console.log('📦 Test product data:', JSON.stringify(testProduct, null, 2));
    
    const product = await SupabaseProduct.create(testProduct);
    
    console.log('✅ SupabaseProduct.create result:', product);
    
    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error('❌ Test create error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.details,
      stack: error.stack 
    });
  }
});

// Test endpoint for sub-subcategory filtering
router.get("/test-filter", async (req, res) => {
  try {
    const { sub_subcategory_id } = req.query;
    
    console.log('🧪 Testing filter with sub_subcategory_id:', sub_subcategory_id);
    
    // Test the query that would be sent to SupabaseProduct
    const query = { is_active: true };
    if (sub_subcategory_id) {
      query.sub_subcategory_id = sub_subcategory_id;
    }
    
    console.log('🔍 Query object:', query);
    
    const productsResult = await SupabaseProduct.find(query, {
      sort: { created_at: { ascending: false } },
      limit: 10
    });
    
    const products = productsResult.data;
    console.log(`📦 Found ${products.length} products`);
    
    // Show first product's sub_subcategory_id for debugging
    if (products.length > 0) {
      console.log('🔍 First product:', {
        name: products[0].name,
        sub_subcategory_id: products[0].sub_subcategory_id,
        sub_subcategory: products[0].sub_subcategory
      });
    }
    
    res.json({
      success: true,
      query,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Test filter error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
