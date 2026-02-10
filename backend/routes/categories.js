const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const iphoneCategoryController = require('../controllers/iphoneCategoryController');

// Public category routes
router.get('/', categoryController.getCategories);
router.get('/hierarchy', categoryController.getCategoriesWithHierarchy);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:slug/products', categoryController.getCategoryProducts);
router.get('/:slug/subcategories', categoryController.getSubcategories);
router.get('/:slug/subcategories/:subcategorySlug/sub-subcategories', categoryController.getSubSubcategories);

// iPhone categories specific routes
router.get('/iphone/hierarchy', iphoneCategoryController.getIPhoneHierarchy);
router.get('/:categorySlug/subcategories/:subcategorySlug/sub-subcategories', iphoneCategoryController.getSubSubcategories);

// Get all categories with subcategories (for navigation)
router.get('/all/with-subcategories', iphoneCategoryController.getAllCategories);

module.exports = router;
