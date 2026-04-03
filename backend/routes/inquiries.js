const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryControllerSupabase");
// const { authMiddleware, adminMiddleware } = require("../middleware/auth"); // Disabled for now

// Public route
router.post("/", inquiryController.createInquiry);

// Admin routes (authentication disabled for now)
router.get("/", inquiryController.getInquiries);
router.put("/:id", inquiryController.updateInquiry);
router.delete("/:id", inquiryController.deleteInquiry);

module.exports = router;
