const SupabaseCategory = require('../models/SupabaseCategory');
const SupabaseSubCategory = require('../models/SupabaseSubCategory');
const SupabaseSubSubCategory = require('../models/SupabaseSubSubCategory');

// Get complete iPhone categories hierarchy
exports.getIPhoneHierarchy = async (req, res) => {
  try {
    const hierarchy = await SupabaseSubSubCategory.getHierarchy('iphone-cases');
    
    // Group the hierarchy by subcategories
    const groupedHierarchy = hierarchy.reduce((acc, item) => {
      const subcategoryKey = item.subcategory_slug;
      
      if (!acc[subcategoryKey]) {
        acc[subcategoryKey] = {
          name: item.subcategory_name,
          slug: item.subcategory_slug,
          id: item.subcategory_id,
          variants: []
        };
      }
      
      acc[subcategoryKey].variants.push({
        name: item.sub_subcategory_name,
        slug: item.sub_subcategory_slug,
        id: item.sub_subcategory_id
      });
      
      return acc;
    }, {});
    
    // Convert to array and sort
    const result = Object.values(groupedHierarchy).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    res.json({
      success: true,
      data: {
        category: {
          name: 'iPhone Cases',
          slug: 'iphone-cases'
        },
        subcategories: result
      }
    });
  } catch (error) {
    console.error('Error fetching iPhone hierarchy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch iPhone categories hierarchy',
      error: error.message
    });
  }
};

// Get all categories (for navigation)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await SupabaseCategory.find({ isActive: true });
    
    // For each category, get its subcategories
    const categoriesWithSubcategories = await Promise.all(
      categories.data.map(async (category) => {
        const subcategories = await SupabaseSubCategory.find({ 
          categoryId: category.id, 
          isActive: true 
        });
        
        return {
          ...category,
          subcategories: subcategories.data
        };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithSubcategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get subcategories for a specific category
exports.getSubcategories = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    
    // Find the category
    const category = await SupabaseCategory.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get subcategories
    const subcategories = await SupabaseSubCategory.find({ 
      categoryId: category.id, 
      isActive: true 
    });
    
    // For each subcategory, get its sub-subcategories
    const subcategoriesWithSubSubcategories = await Promise.all(
      subcategories.data.map(async (subcategory) => {
        const subSubcategories = await SupabaseSubSubCategory.find({ 
          subcategoryId: subcategory.id, 
          isActive: true 
        });
        
        return {
          ...subcategory,
          subSubcategories: subSubcategories.data
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        category,
        subcategories: subcategoriesWithSubSubcategories
      }
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
};

// Get sub-subcategories for a specific subcategory
exports.getSubSubcategories = async (req, res) => {
  try {
    const { categorySlug, subcategorySlug } = req.params;
    
    // Find the category
    const category = await SupabaseCategory.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Find the subcategory
    const subcategory = await SupabaseSubCategory.find({ 
      categoryId: category.id,
      slug: subcategorySlug,
      isActive: true 
    });
    
    if (!subcategory.data || subcategory.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    
    // Get sub-subcategories
    const subSubcategories = await SupabaseSubSubCategory.find({ 
      subcategoryId: subcategory.data[0].id, 
      isActive: true 
    });
    
    res.json({
      success: true,
      data: {
        category,
        subcategory: subcategory.data[0],
        subSubcategories: subSubcategories.data
      }
    });
  } catch (error) {
    console.error('Error fetching sub-subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub-subcategories',
      error: error.message
    });
  }
};
