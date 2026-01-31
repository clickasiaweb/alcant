const SupabaseProduct = require("../models/SupabaseProduct");
const SupabaseCategory = require("../models/SupabaseCategory");

// GET /api/admin/dashboard-summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const [
      totalProductsResult,
      activeCategoriesResult,
      recentProductsResult
    ] = await Promise.all([
      SupabaseProduct.countDocuments(),
      SupabaseCategory.countDocuments({ is_active: true }),
      SupabaseProduct.find({}, { sort: { created_at: -1 }, limit: 5 })
    ]);

    const totalProducts = totalProductsResult;
    const activeCategories = activeCategoriesResult;
    const recentProducts = recentProductsResult.data || [];

    // Mock inquiries data for now since we don't have SupabaseInquiry model
    const pendingInquiries = 0;
    const recentInquiries = [];

    res.json({
      kpis: {
        totalProducts,
        activeCategories,
        pendingInquiries
      },
      recentActivity: {
        recentProducts,
        recentInquiries
      }
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};

// GET /api/admin/products
exports.getAdminProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.is_active = status === "active";
    }

    const [productsResult, total] = await Promise.all([
      SupabaseProduct.find(query, {
        sort: { created_at: -1 },
        skip,
        limit: limitNum
      }),
      SupabaseProduct.countDocuments(query)
    ]);

    const products = productsResult.data || [];

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Admin products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// PATCH /api/admin/product/status/:id
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const product = await SupabaseProduct.findByIdAndUpdate(
      id,
      { isActive }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product status updated successfully",
      product
    });
  } catch (error) {
    console.error("Update product status error:", error);
    res.status(500).json({ error: "Failed to update product status" });
  }
};

// GET /api/admin/categories
exports.getAdminCategories = async (req, res) => {
  try {
    const categoriesResult = await SupabaseCategory.find({}, { sort: { name: 1 } });
    const categories = categoriesResult.data || [];

    res.json({ categories });
  } catch (error) {
    console.error("Admin categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST /api/admin/category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive = true } = req.body;

    // Generate slug if not provided
    const categorySlug = slug || name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const categoryData = {
      name,
      slug: categorySlug,
      description,
      is_active: isActive // Convert to snake_case for Supabase
    };

    const category = await SupabaseCategory.create(categoryData);

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error("Create category error:", error);
    if (error.code === '23505') {
      return res.status(400).json({ error: "Category name or slug already exists" });
    }
    res.status(500).json({ error: "Failed to create category" });
  }
};

// PUT /api/admin/category/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.is_active = isActive; // Convert to snake_case

    const category = await SupabaseCategory.findByIdAndUpdate(id, updateData);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error("Update category error:", error);
    if (error.code === '23505') {
      return res.status(400).json({ error: "Category name or slug already exists" });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
};

// GET /api/content/:page
exports.getContent = async (req, res) => {
  try {
    const { page } = req.params;

    // Mock content for now since we don't have SupabaseContent model
    const content = {
      pageKey: page,
      title: `${page.charAt(0).toUpperCase() + page.slice(1)} Page`,
      content: "Content placeholder",
      isPublished: true
    };

    res.json({ content });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
};

// PUT /api/admin/content/:page
exports.updateContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { title, content, sections, metadata, bannerImage, isPublished } = req.body;

    // Mock content update for now
    const contentDoc = {
      pageKey: page,
      title,
      content,
      sections,
      metadata,
      bannerImage,
      isPublished,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: "Content updated successfully",
      content: contentDoc
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({ error: "Failed to update content" });
  }
};

// POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body
      // Remove createdAt/updatedAt as they're handled by the database
    };

    const product = await SupabaseProduct.create(productData);

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);
    if (error.code === '23505') {
      return res.status(400).json({ error: "Product with this slug already exists" });
    }
    res.status(500).json({ error: "Failed to create product" });
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body
      // Remove updatedAt as it's handled by the database
    };

    const product = await SupabaseProduct.findByIdAndUpdate(id, updateData);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.code === '23505') {
      return res.status(400).json({ error: "Product with this slug already exists" });
    }
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // For Supabase, we need to implement a custom delete method
    const { data, error } = await require('../config/supabase').supabaseService
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product: data
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// DELETE /api/admin/category/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // For Supabase, we need to implement a custom delete method
    const { data, error } = await require('../config/supabase').supabaseService
      .from('categories')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({
      message: "Category deleted successfully",
      category: data
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// GET /api/content/:page
exports.getContent = async (req, res) => {
  try {
    const { page } = req.params;

    const content = await Content.findOne({ pageKey: page });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({ content });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
};

// PUT /api/admin/content/:page
exports.updateContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { title, content, sections, metadata, bannerImage, isPublished } = req.body;

    const updateData = {
      title,
      content,
      sections,
      metadata,
      bannerImage,
      isPublished,
      updatedAt: new Date()
    };

    const contentDoc = await Content.findOneAndUpdate(
      { pageKey: page },
      updateData,
      { new: true, upsert: true }
    );

    res.json({
      message: "Content updated successfully",
      content: contentDoc
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({ error: "Failed to update content" });
  }
};
