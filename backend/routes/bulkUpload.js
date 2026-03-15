const express = require('express');
const router = express.Router();
const { generateTemplate, parseExcelFile, importProducts } = require('../controllers/bulkUploadControllerSupabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get Excel template (without auth for testing)
router.get('/template', generateTemplate);

// Parse and validate Excel file (without auth for testing)
router.post('/parse', parseExcelFile);

// Import validated products (without auth for testing - RLS issue)
router.post('/import', importProducts);

module.exports = router;
