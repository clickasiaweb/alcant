const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public category routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:slug/products', categoryController.getCategoryProducts);
router.get('/:slug/subcategories', categoryController.getSubcategories);

module.exports = router;
