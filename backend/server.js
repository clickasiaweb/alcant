const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first
dotenv.config();

// Import database connection module
const { testConnection, getConnectionStatus } = require('./config/supabase');

// Import routes (only product and auth routes are migrated to Supabase)
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminNoAuth'); // Temporarily using no-auth for testing
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const contentRoutes = require('./routes/content');

// Initialize database connection
testConnection().then((result) => {
  if (result.success) {
    console.log('🚀 Database initialization completed');
  } else {
    console.error('💥 Database initialization failed:', result.error);
    process.exit(1);
  }
}).catch((error) => {
  console.error('💥 Database initialization failed:', error.message);
  process.exit(1);
});

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins temporarily for debugging
    credentials: true,
  }),
);
app.use(express.json({ limit: '100mb' })); // Increased payload limit for videos
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // Increased payload limit for videos

// API Routes (only product and auth routes are migrated to Supabase)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/content', contentRoutes);

// Health check with database status
app.get("/api/health", (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({ 
    status: "Server is running",
    database: dbStatus,
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
