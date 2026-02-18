const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// CORS for frontend
app.use(cors({
  origin: [
    "https://alcant12.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
}));

app.use(express.json());

// Mock categories endpoint (since backend is complex)
app.get("/api/categories/hierarchy", (req, res) => {
  const mockData = {
    data: [
      {
        id: 1,
        name: "Phone Cases",
        slug: "phone-cases",
        subcategories: [
          {
            id: 1,
            name: "iPhone Cases",
            slug: "iphone-cases",
            sub_subcategories: [
              { id: 1, name: "iPhone 15 Pro", slug: "iphone-15-pro" },
              { id: 2, name: "iPhone 15", slug: "iphone-15" }
            ]
          }
        ]
      },
      {
        id: 2,
        name: "Wallets",
        slug: "wallets",
        subcategories: [
          {
            id: 3,
            name: "Men Wallets",
            slug: "men-wallets",
            sub_subcategories: [
              { id: 6, name: "Bifold Wallets", slug: "bifold-wallets" }
            ]
          }
        ]
      }
    ]
  };
  res.json(mockData);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

module.exports = (req, res) => {
  app(req, res);
};
