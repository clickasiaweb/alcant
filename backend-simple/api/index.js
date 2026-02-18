const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { supabase } = require("../config/supabase-simple");

// Load environment variables
dotenv.config({ path: ".env.local" });
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: ".env.production" });
}

const app = express();

// CORS for frontend
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

// Categories endpoint with real Supabase data
app.get("/api/categories/hierarchy", async (req, res) => {
  console.log("📡 Categories endpoint called");
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        image,
        display_order,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .order('display_order', 'asc', 'name');

    if (error) {
      console.error("❌ Error fetching categories:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("📊 Found categories:", data.length);

    // Get subcategories for each category
    const categoriesWithSubcategories = await Promise.all(
      data.map(async (category) => {
        const { data: subcategories, error: subError } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', category.id)
          .eq('is_active', true)
          .order('name', 'asc');

        return {
          ...category,
          subcategories: subcategories || [],
          subcategories_error: subError
        };
      })
    );

    const categoriesData = categoriesWithSubcategories.map(category => ({
      ...category,
      subcategories: category.subcategories || []
    }));

    res.json({ data: categoriesData });
  } catch (error) {
    console.error("❌ Categories endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Products endpoint with real Supabase data
app.get("/api/products/category/:slug", async (req, res) => {
  console.log("📦 Products endpoint called for category:", req.params.slug);
  try {
    const { slug } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', slug)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error("❌ Error fetching products:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("📊 Found products:", data.length);
    res.json({
      products: data || [],
      total: data.length
    });
  } catch (error) {
    console.error("❌ Products endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Content endpoint with real Supabase data
app.get("/api/content/home", async (req, res) => {
  console.log("📄 Content endpoint called");
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('page', 'home')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("❌ Error fetching content:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("📄 Found content:", data ? 'success' : 'not found');
    res.json({ 
      content: data || {
        hero: {
          title: "Welcome to Alcantara",
          subtitle: "Premium luxury materials for your lifestyle",
          content: "Experience the finest Alcantara products crafted with precision and care.",
          buttonText: "Shop Now",
          buttonLink: "/products"
        },
        collections: { title: "Shop Our Collections", items: [] },
        asSeenIn: { title: "As seen in", items: ["REDLINE", "MTAY", "ONDERNEMER", "TopGear"] }
      }
    });
  } catch (error) {
    console.error("❌ Content endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check with database status
app.get("/api/health", async (req, res) => {
  console.log("🏥 Health check called");
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    const dbStatus = {
      connected: !error,
      count: data ? data[0].count : 0,
      error: error ? error.message : null
    };

    res.json({
      status: "Backend API is running",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      endpoints: [
        "/api/categories/hierarchy",
        "/api/products/category/:slug",
        "/api/content/home",
        "/api/health"
      ]
    });
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({ error: error.message });
  }
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
