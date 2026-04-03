const SupabaseProduct = require("../models/SupabaseProduct");

// GET /api/products/filters
exports.getAvailableFilters = async (req, res) => {
  console.log('🔍 Filter endpoint called with query:', req.query);
  try {
    const { category } = req.query;
    
    // Base query for active products
    let baseQuery = { is_active: true };
    if (category) {
      baseQuery.category = category;
    }

    // Get all products to extract filter options
    const productsResult = await SupabaseProduct.find(baseQuery, { limit: 1000 });
    const products = productsResult.data || [];

    // Extract unique values for each filter type
    const filters = {
      colors: [],
      brands: [],
      categories: [],
      subcategories: [],
      subSubcategories: [],
      priceRanges: [
        { label: 'Under $25', min: 0, max: 25, count: 0 },
        { label: '$25 - $50', min: 25, max: 50, count: 0 },
        { label: '$50 - $100', min: 50, max: 100, count: 0 },
        { label: '$100 - $200', min: 100, max: 200, count: 0 },
        { label: 'Over $200', min: 200, max: Infinity, count: 0 }
      ],
      magSafeCompatible: { count: 0 },
      isNew: { count: 0 },
      isLimitedEdition: { count: 0 },
      hasDiscount: { count: 0 }
    };

    const colorSet = new Set();
    const brandSet = new Set();
    const categorySet = new Set();
    const subcategorySet = new Set();
    const subSubcategorySet = new Set();

    products.forEach(product => {
      // Extract colors from variants or images
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(variant => {
          if (variant.color) {
            colorSet.add(variant.color);
          }
        });
      }
      
      // Extract colors from images (if color names are in filenames)
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(image => {
          const colorNames = ['black', 'white', 'red', 'blue', 'green', 'gray', 'grey', 'brown', 'pink', 'purple', 'orange', 'yellow'];
          const filename = image.url || image;
          colorNames.forEach(color => {
            if (filename.toLowerCase().includes(color)) {
              colorSet.add(color.charAt(0).toUpperCase() + color.slice(1));
            }
          });
        });
      }

      // Extract brand
      if (product.brand) {
        brandSet.add(product.brand);
      }

      // Extract categories
      if (product.category) {
        categorySet.add(product.category);
      }
      if (product.subcategory) {
        subcategorySet.add(product.subcategory);
      }
      if (product.sub_subcategory) {
        subSubcategorySet.add(product.sub_subcategory);
      }

      // Count price ranges
      const price = parseFloat(product.price) || 0;
      filters.priceRanges.forEach(range => {
        if (price >= range.min && price < range.max) {
          range.count++;
        }
      });

      // Count boolean features
      if (product.magSafeCompatible) {
        filters.magSafeCompatible.count++;
      }
      if (product.is_new) {
        filters.isNew.count++;
      }
      if (product.is_limited_edition) {
        filters.isLimitedEdition.count++;
      }
      if (product.old_price && parseFloat(product.old_price) > price) {
        filters.hasDiscount.count++;
      }
    });

    // Convert sets to arrays with counts
    filters.colors = Array.from(colorSet).map(color => ({
      name: color,
      hex: getColorHex(color),
      count: products.filter(p => {
        if (p.variants) {
          return p.variants.some(v => v.color === color);
        }
        return false;
      }).length
    })).sort((a, b) => b.count - a.count);

    filters.brands = Array.from(brandSet).map(brand => ({
      name: brand,
      count: products.filter(p => p.brand === brand).length
    })).sort((a, b) => b.count - a.count);

    filters.categories = Array.from(categorySet).map(category => ({
      name: category,
      count: products.filter(p => p.category === category).length
    })).sort((a, b) => b.count - a.count);

    filters.subcategories = Array.from(subcategorySet).map(subcategory => ({
      name: subcategory,
      count: products.filter(p => p.subcategory === subcategory).length
    })).sort((a, b) => b.count - a.count);

    filters.subSubcategories = Array.from(subSubcategorySet).map(subSubcategory => ({
      name: subSubcategory,
      count: products.filter(p => p.sub_subcategory === subSubcategory).length
    })).sort((a, b) => b.count - a.count);

    // Filter out empty options
    filters.priceRanges = filters.priceRanges.filter(range => range.count > 0);

    res.json({
      filters,
      totalProducts: products.length
    });

  } catch (error) {
    console.error("getAvailableFilters error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get hex color from color name
function getColorHex(colorName) {
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#EF4444',
    'Blue': '#3B82F6',
    'Green': '#10B981',
    'Gray': '#6B7280',
    'Grey': '#6B7280',
    'Brown': '#92400E',
    'Pink': '#EC4899',
    'Purple': '#8B5CF6',
    'Orange': '#F97316',
    'Yellow': '#EAB308',
    'Navy': '#1E3A8A',
    'Space Grey': '#3D3D3D',
    'Space Gray': '#3D3D3D',
    'Rose Gold': '#F59E0B',
    'Gold': '#F59E0B',
    'Silver': '#9CA3AF'
  };
  
  return colorMap[colorName] || '#6B7280';
}
