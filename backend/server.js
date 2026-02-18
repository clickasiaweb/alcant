const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first
dotenv.config({ path: ".env.local" });

// Debug: show whether Supabase env vars are loaded
console.log("Loaded env:", {
  SUPABASE_URL: process.env.SUPABASE_URL ? "SET" : "MISSING",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "SET" : "MISSING",
});

// Import database connection module
const { testConnection, getConnectionStatus } = require("./config/supabase");

// Import routes (only product and auth routes are migrated to Supabase)
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminNoAuth"); // Temporarily using no-auth for testing
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const contentRoutes = require("./routes/content");

// Initialize database connection
testConnection()
  .then((result) => {
    if (result.success) {
      console.log("🚀 Database initialization completed");
    } else {
      console.error("💥 Database initialization failed:", result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("💥 Database initialization failed:", error.message);
    process.exit(1);
  });

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://example.com",
      "https://www.example.com",
      "https://admin.example.com",
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

// Health check with database status
app.get("/api/health", (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({
    status: "Server is running",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Temporary endpoint to fix content table
app.post("/api/fix-content-table", async (req, res) => {
  try {
    const { supabaseService } = require("./config/supabase");

    // Try to insert sample data to see what columns exist
    const { data, error } = await supabaseService
      .from("content")
      .insert([
        {
          page_key: "home-hero",
          title: "Welcome to Alcantara",
          subtitle: "Premium luxury materials for your lifestyle",
          content:
            "Experience the finest Alcantara products crafted with precision and care.",
          button_text: "Shop Now",
          button_link: "/products",
          is_published: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting content:", error);

      // Try with camelCase fields
      const { data: camelData, error: camelError } = await supabaseService
        .from("content")
        .insert([
          {
            pageKey: "home-hero",
            title: "Welcome to Alcantara",
            subtitle: "Premium luxury materials for your lifestyle",
            content:
              "Experience the finest Alcantara products crafted with precision and care.",
            buttonText: "Shop Now",
            buttonLink: "/products",
            isPublished: true,
          },
        ])
        .select()
        .single();

      if (camelError) {
        console.error("Error with camelCase:", camelError);
        res.status(500).json({
          error:
            "Table schema issue. Please manually create content table in Supabase.",
          details:
            "Both snake_case and camelCase field names failed. Table may not exist or has different schema.",
          snakeError: error.message,
          camelError: camelError.message,
        });
      } else {
        console.log(
          "Success with camelCase fields! Table created with camelCase schema.",
        );
        res.json({
          message: "Content table fixed with camelCase schema",
          data: camelData,
        });
      }
    } else {
      console.log(
        "Success with snake_case fields! Table exists with snake_case schema.",
      );
      res.json({
        message: "Content table working with snake_case schema",
        data,
      });
    }
  } catch (error) {
    console.error("Error fixing content table:", error);
    res.status(500).json({ error: error.message });
  }
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
