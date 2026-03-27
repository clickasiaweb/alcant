const express = require("express");
const router = express.Router();
const { updateIPhoneLinks } = require("../controllers/updateLinksController");

// POST /api/update/iphone-links
router.post("/iphone-links", updateIPhoneLinks);

module.exports = router;
