const SupabaseProduct = require("../models/SupabaseProduct");
const { body, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Map sort keys to Supabase sort object
const sortMap = {
  popularity: { rating: { ascending: false } },
  newest: { created_at: { ascending: false } },
  price_asc: { price: { ascending: true } },
  price_desc: { price: { ascending: false } },
  rating: { rating: { ascending: false } },
  featured: { created_at: { ascending: false } },
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      subcategory,
      subcategory_id,
      min_price,
      max_price,
      page = 1,
      limit = 24,
      sort = "featured",
      exclude,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { is_active: true };

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (subcategory_id) {
      query.subcategoryId = subcategory_id;
    }

    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseFloat(min_price);
      if (max_price) query.price.$lte = parseFloat(max_price);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subcategory: { $regex: search, $options: "i" } },
      ];
    }

    if (exclude) {
      const excludeIds = String(exclude)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      if (excludeIds.length) {
        query._id = { $nin: excludeIds };
      }
    }

    const [productsResult, total] = await Promise.all([
      SupabaseProduct.find(query, {
        sort: sortMap[sort] || sortMap.featured,
        skip,
        limit: limitNum
      }),
      SupabaseProduct.countDocuments(query)
    ]);

    const products = productsResult.data;

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("getProducts error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/category/:category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const {
      subcategory,
      min_price,
      max_price,
      page = 1,
      limit = 24,
      sort = "featured",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { 
      category: category.toLowerCase(),
      isActive: true 
    };

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseFloat(min_price);
      if (max_price) query.price.$lte = parseFloat(max_price);
    }

    const [productsResult, total] = await Promise.all([
      SupabaseProduct.find(query, {
        sort: sortMap[sort] || sortMap.featured,
        skip,
        limit: limitNum
      }),
      SupabaseProduct.countDocuments(query)
    ]);

    const products = productsResult.data;

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("getProductsByCategory error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await SupabaseProduct.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id] = cat.count;
    });

    res.json({ categories: categoryMap });
  } catch (error) {
    console.error("getCategories error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 12, exclude } = req.query;
    const limitNum = parseInt(limit);

    const query = { isActive: true };

    if (exclude) {
      const excludeIds = String(exclude)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      if (excludeIds.length) {
        query._id = { $nin: excludeIds };
      }
    }

    const productsResult = await SupabaseProduct.find(query, {
      sort: { rating: -1, reviews: -1, created_at: -1 },
      limit: limitNum
    });

    const products = productsResult.data;

    res.json({ products });
  } catch (error) {
    console.error("getFeaturedProducts error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/new
exports.getNewProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const limitNum = parseInt(limit);

    const productsResult = await SupabaseProduct.find({ 
      isActive: true 
    }, {
      sort: { created_at: -1 },
      limit: limitNum
    });

    const products = productsResult.data;

    res.json({ products });
  } catch (error) {
    console.error("getNewProducts error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/sale
exports.getSaleProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const limitNum = parseInt(limit);

    const query = { 
      $or: [
        { oldPrice: { $exists: true, $ne: null } },
        { isBlueMondaySale: true }
      ],
      isActive: true 
    };

    const productsResult = await SupabaseProduct.find(query, {
      sort: { created_at: -1 },
      limit: limitNum
    });

    const products = productsResult.data;

    res.json({ products });
  } catch (error) {
    console.error("getSaleProducts error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/limited-edition
exports.getLimitedEditionProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const limitNum = parseInt(limit);

    const productsResult = await SupabaseProduct.find({ 
      isLimitedEdition: true, 
      isActive: true 
    }, {
      sort: { created_at: -1 },
      limit: limitNum
    });

    const products = productsResult.data;

    res.json({ products });
  } catch (error) {
    console.error("getLimitedEditionProducts error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/search
exports.searchProducts = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 24 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const searchQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { subcategory: { $regex: query, $options: "i" } },
          ],
        },
      ],
    };

    const [productsResult, total] = await Promise.all([
      SupabaseProduct.find(searchQuery, {
        sort: { rating: -1, reviews: -1 },
        skip,
        limit: limitNum
      }),
      SupabaseProduct.countDocuments(searchQuery)
    ]);

    const products = productsResult.data;

    res.json({
      products,
      query,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("searchProducts error", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/slug/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await SupabaseProduct.findOne({ slug, isActive: true });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("getProductBySlug error", error);
    res.status(500).json({ error: error.message });
  }
};

// Create product (Admin)
exports.createProduct = [
  // Validation
  body("name")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Product name must be between 1 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("brand").trim().isLength({ min: 1 }).withMessage("Brand is required"),

  handleValidationErrors,

  async (req, res) => {
    try {
      const product = await SupabaseProduct.create({ ...req.body });

      res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Update product (Admin)
exports.updateProduct = [
  handleValidationErrors,

  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await SupabaseProduct.findByIdAndUpdate(id, updates);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(400).json({ error: error.message });
    }
  },
];

// Archive product (Admin) - Instead of delete
exports.archiveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await SupabaseProduct.findByIdAndUpdate(
      id,
      { status: "archived" }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product archived successfully", data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get static subcategories (legacy)
exports.getSubcategories = async (req, res) => {
  try {
    res.json({ data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/recommended
exports.getRecommendedProducts = async (req, res) => {
  try {
    const {
      subcategory_id,
      exclude,
      limit = 4
    } = req.query;

    const query = { isActive: true };

    if (subcategory_id) {
      query.subcategoryId = subcategory_id;
    }

    if (exclude) {
      const excludeIds = String(exclude)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      if (excludeIds.length) {
        query._id = { $nin: excludeIds };
      }
    }

    const productsResult = await SupabaseProduct.find(query, {
      sort: { rating: -1, created_at: -1 },
      limit: parseInt(limit)
    });

    const products = productsResult.data;

    res.json({ products });
  } catch (error) {
    console.error("getRecommendedProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const query = { is_active: true };

    const productsResult = await SupabaseProduct.find(query, {
      sort: { created_at: { ascending: false }, rating: { ascending: false } },
      limit: parseInt(limit)
    });

    const products = productsResult.data || [];

    res.json({ data: products });
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
};
