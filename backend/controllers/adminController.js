const SupabaseProduct = require("../models/SupabaseProduct");
const SupabaseCategory = require("../models/SupabaseCategory");
const SupabaseSubCategory = require("../models/SupabaseSubCategory");
const SupabaseSubSubCategory = require("../models/SupabaseSubSubCategory");

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

// GET /api/admin/categories - Updated for 3-level hierarchy
exports.getAdminCategories = async (req, res) => {
  try {
    // First try to use the view
    try {
      const { data, error } = await require('../config/supabase').supabase
        .from('categories_with_subcategories')
        .select('*');
      
      if (!error && data) {
        return res.json({ data: data });
      }
    } catch (viewError) {
      console.log('View not available, using fallback method');
    }
    
    // Fallback: Fetch categories and subcategories separately from database
    const categoriesResult = await SupabaseCategory.find({ is_active: true });
    const categories = categoriesResult.data || [];
    
    // Fetch real subcategories from database
    const subcategoriesResult = await SupabaseSubCategory.find({ is_active: true });
    const subcategories = subcategoriesResult.data || [];
    
    // Fetch real sub-subcategories from database
    const subSubcategoriesResult = await SupabaseSubSubCategory.find({ is_active: true });
    const subSubcategories = subSubcategoriesResult.data || [];
    
    // Build the hierarchy
    const categoriesWithSubcategories = categories.map(category => {
      const categorySubcategories = subcategories.filter(sub => sub.category_id === category.id);
      
      return {
        ...category,
        subcategories: categorySubcategories.map(sub => {
          const subSubcategoriesForSub = subSubcategories.filter(subSub => subSub.subcategory_id === sub.id);
          
          return {
            ...sub,
            category_name: category.name,
            category_slug: category.slug,
            sub_subcategories: subSubcategoriesForSub
          };
        })
      };
    });
    
    res.json({ data: categoriesWithSubcategories });
  } catch (error) {
    console.error("Admin categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Helper function to generate mock subcategories (same as in categoryController)
function getMockSubcategories(categoryName) {
  const mockData = {
    'Accessories': [
      { name: 'Watch Bands', slug: 'watch-bands' },
      { name: 'Keychains', slug: 'keychains' },
      { name: 'Tech Accessories', slug: 'tech-accessories' }
    ],
    'Phone Cases': [
      { name: 'iPhone Cases', slug: 'iphone-cases' },
      { name: 'Samsung Cases', slug: 'samsung-cases' },
      { name: 'Google Pixel Cases', slug: 'google-pixel-cases' }
    ],
    'Wallets & Cards': [
      { name: 'Card Holders', slug: 'card-holders' },
      { name: 'Full Wallets', slug: 'full-wallets' },
      { name: 'Mini Wallets', slug: 'mini-wallets' }
    ],
    'Car & Travel': [
      { name: 'Car Accessories', slug: 'car-accessories' },
      { name: 'Travel Essentials', slug: 'travel-essentials' },
      { name: 'Luxury Travel', slug: 'luxury-travel' }
    ],
    'Electronics': [
      { name: 'Phones', slug: 'phones' },
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Tablets', slug: 'tablets' },
      { name: 'Accessories', slug: 'accessories' }
    ]
  };
  return mockData[categoryName] || [];
}

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

    // Use the actual Content model
    const Content = require('../models/Content');
    let content = await Content.findOne({ pageKey: page });
    
    // If no content exists, create default content
    if (!content) {
      content = new Content({
        pageKey: page,
        title: `${page.charAt(0).toUpperCase() + page.slice(1)} Page`,
        content: "Content placeholder",
        isPublished: true
      });
      await content.save();
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
    const updateData = req.body;

    // Use the actual Content model
    const Content = require('../models/Content');
    
    // Find existing content or create new
    let content = await Content.findOne({ pageKey: page });
    
    if (content) {
      // Update existing content
      Object.keys(updateData).forEach(key => {
        content[key] = updateData[key];
      });
      content.updatedAt = new Date();
    } else {
      // Create new content
      content = new Content({
        pageKey: page,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await content.save();

    res.json({
      message: "Content updated successfully",
      content
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

// Subcategory and Sub-subcategory methods for 3-level hierarchy

// GET /api/admin/subcategories
exports.getSubCategories = async (req, res) => {
  try {
    const subcategoriesResult = await SupabaseSubCategory.find({ is_active: true });
    const subcategories = subcategoriesResult.data || [];
    
    // Get category names for each subcategory
    const subcategoriesWithCategoryNames = await Promise.all(
      subcategories.map(async (subcategory) => {
        const category = await SupabaseCategory.findById(subcategory.category_id);
        return {
          ...subcategory,
          category_name: category ? category.name : 'Unknown',
          category_slug: category ? category.slug : 'unknown'
        };
      })
    );

    res.json({ data: subcategoriesWithCategoryNames });
  } catch (error) {
    console.error("Get subcategories error:", error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

// GET /api/admin/sub-subcategories
exports.getSubSubCategories = async (req, res) => {
  try {
    const subSubcategoriesResult = await SupabaseSubSubCategory.find({ is_active: true });
    const subSubcategories = subSubcategoriesResult.data || [];
    
    // Get subcategory and category names for each sub-subcategory
    const subSubcategoriesWithNames = await Promise.all(
      subSubcategories.map(async (subSubcategory) => {
        let category_name = 'Unknown';
        let subcategory_name = 'Unknown';
        
        // Only try to get parent if subcategory_id is not null
        if (subSubcategory.subcategory_id) {
          try {
            // Get parent subcategory
            const subcategory = await SupabaseSubCategory.findById(subSubcategory.subcategory_id);
            
            if (subcategory) {
              subcategory_name = subcategory.name;
              // Get parent category
              if (subcategory.category_id) {
                try {
                  const category = await SupabaseCategory.findById(subcategory.category_id);
                  if (category) {
                    category_name = category.name;
                  }
                } catch (catError) {
                  console.log('Error fetching category:', catError.message);
                }
              }
            }
          } catch (subError) {
            console.log('Error fetching subcategory:', subError.message);
          }
        }
        
        return {
          ...subSubcategory,
          category_name,
          subcategory_name
        };
      })
    );

    res.json({ data: subSubcategoriesWithNames });
  } catch (error) {
    console.error("Get sub-subcategories error:", error);
    res.status(500).json({ error: "Failed to fetch sub-subcategories" });
  }
};

// POST /api/admin/subcategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, slug, categoryId, description, isActive = true } = req.body;

    // Generate slug if not provided
    const subcategorySlug = slug || name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const subcategoryData = {
      name,
      slug: subcategorySlug,
      category_id: categoryId,
      description,
      is_active: isActive
    };

    const subcategory = await SupabaseSubCategory.create(subcategoryData);

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory
    });
  } catch (error) {
    console.error("Create subcategory error:", error);
    res.status(500).json({ error: "Failed to create subcategory" });
  }
};

// POST /api/admin/sub-subcategory
exports.createSubSubCategory = async (req, res) => {
  try {
    const { name, slug, subcategoryId, description, sortOrder = 0, isActive = true } = req.body;

    // Generate slug if not provided
    const subSubcategorySlug = slug || name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const subSubcategoryData = {
      name,
      slug: subSubcategorySlug,
      subcategory_id: subcategoryId,
      description,
      sort_order: sortOrder,
      is_active: isActive
    };

    const subSubcategory = await SupabaseSubSubCategory.create(subSubcategoryData);

    res.status(201).json({
      message: "Sub-subcategory created successfully",
      subSubcategory
    });
  } catch (error) {
    console.error("Create sub-subcategory error:", error);
    res.status(500).json({ error: "Failed to create sub-subcategory" });
  }
};

// PUT /api/admin/subcategory/:id
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, isActive } = req.body;

    const updateData = {
      name,
      slug,
      description,
      is_active: isActive
    };

    const subcategory = await SupabaseSubCategory.findByIdAndUpdate(id, updateData);

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.json({
      message: "Subcategory updated successfully",
      subcategory
    });
  } catch (error) {
    console.error("Update subcategory error:", error);
    res.status(500).json({ error: "Failed to update subcategory" });
  }
};

// PUT /api/admin/sub-subcategory/:id
exports.updateSubSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, sortOrder, isActive } = req.body;

    const updateData = {
      name,
      slug,
      description,
      sort_order: sortOrder,
      is_active: isActive
    };

    const subSubcategory = await SupabaseSubSubCategory.findByIdAndUpdate(id, updateData);

    if (!subSubcategory) {
      return res.status(404).json({ error: "Sub-subcategory not found" });
    }

    res.json({
      message: "Sub-subcategory updated successfully",
      subSubcategory
    });
  } catch (error) {
    console.error("Update sub-subcategory error:", error);
    res.status(500).json({ error: "Failed to update sub-subcategory" });
  }
};

// DELETE /api/admin/subcategory/:id
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // This should cascade delete sub-subcategories
    const { error } = await require('../config/supabase').supabaseService
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      message: "Subcategory deleted successfully"
    });
  } catch (error) {
    console.error("Delete subcategory error:", error);
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};

// DELETE /api/admin/sub-subcategory/:id
exports.deleteSubSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await require('../config/supabase').supabaseService
      .from('sub_subcategories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      message: "Sub-subcategory deleted successfully"
    });
  } catch (error) {
    console.error("Delete sub-subcategory error:", error);
    res.status(500).json({ error: "Failed to delete sub-subcategory" });
  }
};
