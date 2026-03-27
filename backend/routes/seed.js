const express = require("express");
const router = express.Router();
const { seedIPhoneSubSubCategories } = require("../controllers/seedIPhoneCategories");

// POST /api/seed/iphone-sub-subcategories
router.post("/iphone-sub-subcategories", seedIPhoneSubSubCategories);

module.exports = router;
