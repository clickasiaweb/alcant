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
      sub_subcategory_id,
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

    if (sub_subcategory_id) {
      query.sub_subcategory_id = sub_subcategory_id;
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

    // For testing: Return some products as featured even if not marked in DB
    const query = { is_active: true };

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

    let products = productsResult.data;

    // For testing: Mark first few products as featured temporarily
    if (products && products.length > 0) {
      products = products.slice(0, 6); // Limit to 6 for slider
    }

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
    const searchQueryLower = query.toLowerCase().trim();

    console.log('🔍 Search query:', searchQueryLower);

    // Create multiple search queries with different priority levels
    const queries = [];

    // Priority 1: Exact name match (highest priority)
    queries.push({
      match: 'exact_name',
      query: {
        $and: [
          { isActive: true },
          { name: { $regex: `^${searchQueryLower}$`, $options: "i" } }
        ]
      }
    });

    // Priority 2: Name starts with query (high priority)
    queries.push({
      match: 'name_starts',
      query: {
        $and: [
          { isActive: true },
          { name: { $regex: `^${searchQueryLower}`, $options: "i" } }
        ]
      }
    });

    // Priority 3: Name contains query (medium priority)
    queries.push({
      match: 'name_contains',
      query: {
        $and: [
          { isActive: true },
          { name: { $regex: searchQueryLower, $options: "i" } }
        ]
      }
    });

    // Priority 4: Category or description contains query (lower priority)
    queries.push({
      match: 'category_description',
      query: {
        $and: [
          { isActive: true },
          { 
            $or: [
              { category: { $regex: searchQueryLower, $options: "i" } },
              { description: { $regex: searchQueryLower, $options: "i" } },
              { subcategory: { $regex: searchQueryLower, $options: "i" } }
            ]
          }
        ]
      }
    });

    // Execute all queries
    const results = await Promise.all(
      queries.map(q => SupabaseProduct.find(q.query, { limit: limitNum }))
    );

    // Process results and add priority scores
    const allProducts = [];
    const seenIds = new Set();

    results.forEach((result, index) => {
      const priority = queries[index].match;
      const products = result.data || [];
      
      products.forEach(product => {
        if (!seenIds.has(product.id)) {
          seenIds.add(product.id);
          allProducts.push({
            ...product,
            _searchPriority: index,
            _matchType: priority
          });
        }
      });
    });

    // Sort by priority first, then by rating and reviews
    allProducts.sort((a, b) => {
      if (a._searchPriority !== b._searchPriority) {
        return a._searchPriority - b._searchPriority;
      }
      // Within same priority, sort by rating and reviews
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviews - a.reviews;
    });

    // Remove priority fields and limit results
    const finalProducts = allProducts
      .slice(skip, skip + limitNum)
      .map(({ _searchPriority, _matchType, ...product }) => product);

    // Get total count
    const totalQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchQueryLower, $options: "i" } },
            { description: { $regex: searchQueryLower, $options: "i" } },
            { category: { $regex: searchQueryLower, $options: "i" } },
            { subcategory: { $regex: searchQueryLower, $options: "i" } },
          ],
        },
      ],
    };
    const total = await SupabaseProduct.countDocuments(totalQuery);

    console.log('📊 Search results:', {
      query: searchQueryLower,
      totalFound: allProducts.length,
      returned: finalProducts.length,
      firstResult: finalProducts[0]?.name
    });

    res.json({
      products: finalProducts,
      query,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + finalProducts.length < total,
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
    const product = await SupabaseProduct.findOne({ slug, is_active: true });

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
      console.log('🔍 Create product request body:', JSON.stringify(req.body, null, 2));
      
      // ✅ DEBUG: Check if sub-subcategory fields are present
      if (req.body.sub_subcategory) {
        console.log('✅ sub_subcategory received:', req.body.sub_subcategory);
      } else {
        console.log('❌ sub_subcategory MISSING in request');
      }
      
      if (req.body.sub_sub_subcategory) {
        console.log('✅ sub_sub_subcategory received:', req.body.sub_sub_subcategory);
      } else {
        console.log('❌ sub_sub_subcategory MISSING in request');
      }
      
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

      // ✅ PRD MANDATORY: Add logging for debugging
      console.log("🔍 Update payload:", JSON.stringify(updates, null, 2));
      console.log("🎯 Product ID:", id);

      const product = await SupabaseProduct.findByIdAndUpdate(id, updates);

      if (!product) {
        console.log("❌ Product not found for ID:", id);
        return res.status(404).json({ error: "Product not found" });
      }

      console.log("✅ Product updated successfully:", JSON.stringify(product, null, 2));
      
      res.json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      // ✅ PRD MANDATORY: Enhanced error logging
      console.error("❌ Update product error:", error);
      console.error("❌ Error details:", error.message);
      console.error("❌ Error stack:", error.stack);
      console.error("❌ Request body:", JSON.stringify(req.body, null, 2));
      
      // ✅ FIX: Return proper error response
      res.status(400).json({ 
        error: error.message,
        details: error.details || null
      });
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
      sub_subcategory_id,
      exclude,
      limit = 4
    } = req.query;

    const query = { isActive: true };

    if (subcategory_id) {
      query.subcategoryId = subcategory_id;
    }

    if (sub_subcategory_id) {
      query.sub_subcategory_id = sub_subcategory_id;
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
