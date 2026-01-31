const SupabaseCategory = require('../models/SupabaseCategory');
const SupabaseProduct = require('../models/SupabaseProduct');

// GET /api/categories - returns active categories with product counts
exports.getCategories = async (req, res) => {
  try {
    const categoriesResult = await SupabaseCategory.find(
      { is_active: true }, 
      { sort: { name: 1 } } // Sort by name since display_order doesn't exist
    );
    
    const categories = categoriesResult.data || [];
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productsResult = await SupabaseProduct.find(
          { category_id: category.id, is_active: true },
          { limit: 1 } // Just need count
        );
        
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          // Remove display_order since it doesn't exist
          product_count: productsResult.count || 0
        };
      })
    );

    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// GET /api/categories/:slug - get single category with products
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await SupabaseCategory.findOne({ slug, is_active: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get products for this category
    const productsResult = await SupabaseProduct.find(
      { category_id: category.id, is_active: true },
      { sort: { created_at: -1 }, limit: 20 }
    );
    
    const products = productsResult.data || [];

    res.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image
      },
      products
    });
  } catch (error) {
    console.error('Category fetch error:', error);
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// GET /api/categories/:slug/products - get products for a category
exports.getCategoryProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 20, sort = 'created_at', subcategory } = req.query;
    
    // Find category first
    const category = await SupabaseCategory.findOne({ slug, is_active: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Determine sort order
    let sortField = 'created_at';
    let sortOrder = { created_at: -1 }; // default: newest first
    
    if (sort === 'price_low') {
      sortField = 'price';
      sortOrder = { price: 1 };
    } else if (sort === 'price_high') {
      sortField = 'price';
      sortOrder = { price: -1 };
    } else if (sort === 'name') {
      sortField = 'name';
      sortOrder = { name: 1 };
    }

    // Build query
    const query = { category: category.id, is_active: true };
    
    // Add subcategory filter if provided
    if (subcategory) {
      query.subcategory = subcategory;
    }

    const [productsResult, totalResult] = await Promise.all([
      SupabaseProduct.find(
        query,
        { sort: sortOrder, skip, limit: limitNum }
      ),
      SupabaseProduct.countDocuments(query)
    ]);

    const products = productsResult.data || [];
    const total = totalResult;

    res.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Category products fetch error:', error);
    res.status(500).json({ message: 'Error fetching category products', error: error.message });
  }
};

// GET /api/categories/:slug/subcategories - get subcategories for a category
exports.getSubcategories = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find category first
    const category = await SupabaseCategory.findOne({ slug, is_active: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // For now, return mock subcategories based on category name
    // In a real implementation, you would fetch these from a subcategories table
    const mockSubcategories = getMockSubcategories(category.name);
    
    res.json({ subcategories: mockSubcategories });
  } catch (error) {
    console.error('Subcategories fetch error:', error);
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};

// Helper function to generate mock subcategories
function getMockSubcategories(categoryName) {
  const mockData = {
    'rtgrgdfg': [
      { name: 'Phone', slug: 'phone' },
      { name: 'General', slug: 'general' },
      { name: 'Test Subcategory', slug: 'test-subcategory' }
    ],
    'Test Admin Panel': [
      { name: 'Phone', slug: 'phone' },
      { name: 'General', slug: 'general' },
      { name: 'Test Subcategory', slug: 'test-subcategory' }
    ],
    'Test Category': [
      { name: 'General', slug: 'general' },
      { name: 'Test Subcategory', slug: 'test-subcategory' }
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
    'Accessories': [
      { name: 'Watch Bands', slug: 'watch-bands' },
      { name: 'Keychains', slug: 'keychains' },
      { name: 'Tech Accessories', slug: 'tech-accessories' }
    ],
    'Car & Travel': [
      { name: 'Car Accessories', slug: 'car-accessories' },
      { name: 'Travel Essentials', slug: 'travel-essentials' },
      { name: 'Luxury Travel', slug: 'luxury-travel' }
    ]
  };
  return mockData[categoryName] || [];
}