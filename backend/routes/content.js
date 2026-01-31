const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentControllerMemory");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Public route
router.get("/:pageKey", contentController.getContent);

// Admin route (temporarily without auth for testing)
router.put(
  "/:pageKey",
  // authMiddleware,
  // adminMiddleware,
  contentController.updateContent,
);

module.exports = router;
