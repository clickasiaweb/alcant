const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first
// On Vercel, env vars are automatically available
// For local development, load from .env.local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: ".env.production" });
}

// Debug: show whether Supabase env vars are loaded
console.log("Loaded env:", {
  SUPABASE_URL: process.env.SUPABASE_URL ? "SET" : "MISSING",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "SET" : "MISSING",
  NODE_ENV: process.env.NODE_ENV || "MISSING"
});

// Import database connection module
const { testConnection, getConnectionStatus } = require("../config/supabase");

// Import routes (only product and auth routes are migrated to Supabase)
const authRoutes = require("../routes/auth");
const adminRoutes = require("../routes/adminNoAuth"); // Use no-auth routes for testing
const productRoutes = require("../routes/products");
const categoryRoutes = require("../routes/categories");
const contentRoutes = require("../routes/content");
const categoryBulkRoutes = require("../controllers/categoryBulkController");
const subcategoryUploadRoutes = require("../controllers/subcategoryUploadController");
const subSubcategoryUploadRoutes = require("../controllers/subSubcategoryUploadController");
const categoryUploadDirectRoutes = require("../controllers/categoryUploadDirectController");
const setupRoutes = require("../routes/setup");
const bulkUploadRoutes = require("../routes/bulkUpload");
const seedRoutes = require("../routes/seed");
const updateRoutes = require("../routes/update");

const app = express();

// Test database connection asynchronously (don't block startup)
testConnection()
  .then((result) => {
    if (result.success) {
      console.log("🚀 Database initialization completed");
    } else {
      console.error("💥 Database initialization failed:", result.error);
      // Don't exit, just log the error
    }
  })
  .catch((error) => {
    console.error("💥 Database initialization failed:", error.message);
    // Don't exit, just log the error
  });

// Middleware
app.use(
  cors({
    origin: [
      "https://alcant.in",
      "https://www.alcant.in",
      "https://admin.alcant.in",
      "https://api.alcant.in",
      "https://alcannt.in",
      "https://www.alcannt.in",
      "https://admin.alcannt.in",
      "https://api.alcannt.in",
      "https://alcant-website.vercel.app",
      "https://alcant-backend.vercel.app",
      "https://alcant-three.vercel.app",
      "https://alcant12.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "100mb" })); // Increased payload limit for videos
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // Increased payload limit for videos

// API Routes (only product and auth routes are migrated to Supabase)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/categories/bulk", categoryBulkRoutes);
app.use("/api/subcategories/upload", subcategoryUploadRoutes);
app.use("/api/sub-subcategories/upload", subSubcategoryUploadRoutes);
app.use("/api/categories/direct", categoryUploadDirectRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/products/bulk-upload", bulkUploadRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/update", updateRoutes);

// Health check with database status
app.get("/api/health", (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({
    status: "Server is running",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Root route for backend
app.get("/", (req, res) => {
  res.json({
    message: "Alcant Backend API is running",
    version: "1.0.0",
    status: "Active",
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      "bulk-upload": "/api/products/bulk-upload",
      categories: "/api/categories",
      content: "/api/content",
      auth: "/api/auth"
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export for Vercel serverless function
module.exports = (req, res) => {
  app(req, res);
};
