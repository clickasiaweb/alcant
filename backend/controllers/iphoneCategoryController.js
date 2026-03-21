const SupabaseCategory = require('../models/SupabaseCategory');
const SupabaseSubCategory = require('../models/SupabaseSubCategory');
const SupabaseSubSubCategory = require('../models/SupabaseSubSubCategory');
const SupabaseSub3Category = require('../models/SupabaseSub3Category');

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

// Get all categories (for navigation) - Updated for 4-level hierarchy
exports.getAllCategories = async (req, res) => {
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
    
    // Fetch all sub3 categories (optional - may not exist yet)
    let sub3Categories = [];
    try {
      const sub3CategoriesResult = await SupabaseSub3Category.find({ is_active: true });
      sub3Categories = sub3CategoriesResult.data || [];
    } catch (error) {
      console.log('⚠️ Sub3 categories table not found, skipping level 4 categories');
      // Continue without sub3 categories
    }
    
    // Build the hierarchy
    const categoriesWithHierarchy = categories.map(category => {
      const categorySubcategories = subcategories.filter(sub => sub.category_id === category.id);
      
      return {
        ...category,
        subcategories: categorySubcategories.map(sub => {
          const subSubcategoriesForSub = subSubcategories.filter(subSub => subSub.subcategory_id === sub.id);
          
          return {
            ...sub,
            sub_subcategories: subSubcategoriesForSub.map(subSub => {
              const sub3CategoriesForSubSub = sub3Categories.filter(sub3 => sub3.sub_subcategory_id === subSub.id);
              
              return {
                ...subSub,
                sub3_categories: sub3CategoriesForSubSub
              };
            })
          };
        })
      };
    });
    
    res.json({
      success: true,
      data: categoriesWithHierarchy
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
