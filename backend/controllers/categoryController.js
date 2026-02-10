const SupabaseCategory = require('../models/SupabaseCategory');
const SupabaseProduct = require('../models/SupabaseProduct');
const SupabaseSubCategory = require('../models/SupabaseSubCategory');
const SupabaseSubSubCategory = require('../models/SupabaseSubSubCategory');

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

// GET /api/categories - returns categories with full hierarchy for dropdown
exports.getCategoriesWithHierarchy = async (req, res) => {
  try {
    // Fetch all categories
    const categoriesResult = await SupabaseCategory.find({ is_active: true });
    const categories = categoriesResult.data || [];
    
    // Fetch all subcategories
    const subcategoriesResult = await SupabaseSubCategory.find({ is_active: true });
    const subcategories = subcategoriesResult.data || [];
    
    // Fetch all sub-subcategories
    const subSubcategoriesResult = await SupabaseSubSubCategory.find({ is_active: true });
    const subSubcategories = subSubcategoriesResult.data || [];
    
    // Build the hierarchy
    const categoriesWithHierarchy = categories.map(category => {
      const categorySubcategories = subcategories.filter(sub => sub.category_id === category.id);
      
      return {
        ...category,
        subcategories: categorySubcategories.map(sub => {
          const subSubcategoriesForSub = subSubcategories.filter(subSub => subSub.subcategory_id === sub.id);
          
          return {
            ...sub,
            sub_subcategories: subSubcategoriesForSub
          };
        })
      };
    });
    
    res.json({ data: categoriesWithHierarchy });
  } catch (error) {
    console.error('Categories hierarchy fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch categories hierarchy' });
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

// GET /api/categories/:slug/subcategories/:subcategorySlug/sub-subcategories - get sub-subcategories for a subcategory
exports.getSubSubcategories = async (req, res) => {
  try {
    const { slug, subcategorySlug } = req.params;
    
    // Find category first
    const category = await SupabaseCategory.findOne({ slug, is_active: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // For now, return mock sub-subcategories based on subcategory name
    const mockSubSubcategories = getMockSubSubcategories(subcategorySlug);
    
    res.json({ subSubcategories: mockSubSubcategories });
  } catch (error) {
    console.error('Sub-subcategories fetch error:', error);
    res.status(500).json({ message: 'Error fetching sub-subcategories', error: error.message });
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

// Helper function to generate mock sub-subcategories
function getMockSubSubcategories(subcategorySlug) {
  const mockData = {
    'watch-bands': [
      { name: 'Apple Watch Bands', slug: 'apple-watch-bands' },
      { name: 'Samsung Watch Bands', slug: 'samsung-watch-bands' },
      { name: 'Universal Watch Bands', slug: 'universal-watch-bands' },
      { name: 'Leather Watch Bands', slug: 'leather-watch-bands' },
      { name: 'Sport Watch Bands', slug: 'sport-watch-bands' }
    ],
    'keychains': [
      { name: 'Alcantara Keychains', slug: 'alcantara-keychains' },
      { name: 'Metal Keychains', slug: 'metal-keychains' },
      { name: 'Leather Keychains', slug: 'leather-keychains' },
      { name: 'Custom Keychains', slug: 'custom-keychains' },
      { name: 'Luxury Keychains', slug: 'luxury-keychains' }
    ],
    'tech-accessories': [
      { name: 'Phone Stands', slug: 'phone-stands' },
      { name: 'Cable Organizers', slug: 'cable-organizers' },
      { name: 'Desk Mats', slug: 'desk-mats' },
      { name: 'Tech Pouches', slug: 'tech-pouches' },
      { name: 'Wireless Chargers', slug: 'wireless-chargers' }
    ],
    'car-accessories': [
      { name: 'Car Mats', slug: 'car-mats' },
      { name: 'Seat Covers', slug: 'seat-covers' },
      { name: 'Dashboard Covers', slug: 'dashboard-covers' },
      { name: 'Steering Wheel Covers', slug: 'steering-wheel-covers' }
    ],
    'travel-essentials': [
      { name: 'Travel Pouches', slug: 'travel-pouches' },
      { name: 'Passport Holders', slug: 'passport-holders' },
      { name: 'Luggage Tags', slug: 'luggage-tags' },
      { name: 'Travel Organizers', slug: 'travel-organizers' }
    ],
    'card-holders': [
      { name: 'Minimal Card Holders', slug: 'minimal-card-holders' },
      { name: 'RFID Card Holders', slug: 'rfid-card-holders' },
      { name: 'Multi Card Holders', slug: 'multi-card-holders' },
      { name: 'Premium Card Holders', slug: 'premium-card-holders' }
    ],
    'full-wallets': [
      { name: 'Bifold Wallets', slug: 'bifold-wallets' },
      { name: 'Trifold Wallets', slug: 'trifold-wallets' },
      { name: 'Minimal Wallets', slug: 'minimal-wallets' },
      { name: 'Luxury Wallets', slug: 'luxury-wallets' }
    ]
  };
  return mockData[subcategorySlug] || [];
}