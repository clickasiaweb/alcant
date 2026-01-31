const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Public route
router.post("/", inquiryController.createInquiry);

// Admin routes
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  inquiryController.getInquiries,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  inquiryController.updateInquiry,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  inquiryController.deleteInquiry,
);

module.exports = router;
