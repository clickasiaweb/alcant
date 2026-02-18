const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { supabase, testConnection } = require("./config/supabase-simple");

// Load environment variables
dotenv.config({ path: ".env.local" });
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: ".env.production" });
}

// Debug: show whether Supabase env vars are loaded
console.log("Loaded env:", {
  SUPABASE_URL: process.env.SUPABASE_URL ? "SET" : "MISSING",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "SET" : "MISSING",
  NODE_ENV: process.env.NODE_ENV || "MISSING"
});

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminNoAuth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const contentRoutes = require("./routes/content");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://alcant12.vercel.app",
    "https://www.alcant12.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  credentials: true,
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/content", contentRoutes);

// Health check with database status
app.get("/api/health", async (req, res) => {
  const dbStatus = getConnectionStatus();
  const testResult = await testConnection();
  res.json({
    status: "Server is running",
    database: dbStatus,
    testResult,
    timestamp: new Date().toISOString(),
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

module.exports = app;
