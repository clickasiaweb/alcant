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

// Mock categories endpoint (matches frontend expectations)
app.get("/api/categories/hierarchy", (req, res) => {
  console.log("📡 Categories endpoint called");
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
              { id: 2, name: "iPhone 15", slug: "iphone-15" },
              { id: 3, name: "iPhone 14", slug: "iphone-14" }
            ]
          },
          {
            id: 2,
            name: "Samsung Cases",
            slug: "samsung-cases",
            sub_subcategories: [
              { id: 4, name: "Galaxy S24", slug: "galaxy-s24" },
              { id: 5, name: "Galaxy S23", slug: "galaxy-s23" }
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
              { id: 6, name: "Bifold Wallets", slug: "bifold-wallets" },
              { id: 7, name: "Trifold Wallets", slug: "trifold-wallets" }
            ]
          },
          {
            id: 4,
            name: "Card Holders",
            slug: "card-holders",
            sub_subcategories: [
              { id: 8, name: "Minimal Card Holder", slug: "minimal-card-holder" }
            ]
          }
        ]
      },
      {
        id: 3,
        name: "Accessories",
        slug: "accessories",
        subcategories: [
          {
            id: 5,
            name: "Tech Accessories",
            slug: "tech-accessories",
            sub_subcategories: [
              { id: 9, name: "AirPod Cases", slug: "airpod-cases" },
              { id: 10, name: "Watch Bands", slug: "watch-bands" }
            ]
          }
        ]
      }
    ]
  };
  console.log("📊 Returning categories data:", mockData.data.length, "categories");
  res.json(mockData);
});

// Mock products endpoint for category
app.get("/api/products/category/:slug", (req, res) => {
  const { slug } = req.params;
  console.log("📦 Products endpoint called for category:", slug);
  
  const mockProducts = [
    {
      id: 1,
      name: "Premium iPhone 15 Pro Case",
      slug: "premium-iphone-15-pro-case",
      price: 49.99,
      category: slug,
      subcategory: "iphone-cases",
      image: `https://picsum.photos/seed/${slug}-1/300/300.jpg`
    },
    {
      id: 2,
      name: "Luxury Leather Wallet",
      slug: "luxury-leather-wallet",
      price: 89.99,
      category: slug,
      subcategory: "men-wallets",
      image: `https://picsum.photos/seed/${slug}-2/300/300.jpg`
    },
    {
      id: 3,
      name: "Alcantara AirPod Case",
      slug: "alcantara-airpod-case",
      price: 34.99,
      category: slug,
      subcategory: "tech-accessories",
      image: `https://picsum.photos/seed/${slug}-3/300/300.jpg`
    }
  ];
  
  const filteredProducts = mockProducts.filter(p => p.category === slug);
  res.json({
    products: filteredProducts.slice(0, 8),
    total: filteredProducts.length
  });
});

// Mock content endpoint
app.get("/api/content/home", (req, res) => {
  console.log("📄 Content endpoint called");
  const mockContent = {
    hero: {
      title: "Welcome to Alcantara",
      subtitle: "Premium luxury materials for your lifestyle",
      content: "Experience the finest Alcantara products crafted with precision and care.",
      buttonText: "Shop Now",
      buttonLink: "/products"
    },
    collections: {
      title: "Shop Our Collections",
      items: []
    },
    asSeenIn: {
      title: "As seen in",
      items: ["REDLINE", "MTAY", "ONDERNEMER", "TopGear"]
    }
  };
  res.json({ content: mockContent });
});

// Health check
app.get("/api/health", (req, res) => {
  console.log("🏥 Health check called");
  res.json({
    status: "Backend API is running",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/categories/hierarchy",
      "/api/products/category/:slug",
      "/api/content/home",
      "/api/health"
    ]
  });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ 404 for:", req.method, req.url);
  res.status(404).json({ 
    error: "API endpoint not found",
    url: req.url,
    method: req.method
  });
});

module.exports = (req, res) => {
  app(req, res);
};
