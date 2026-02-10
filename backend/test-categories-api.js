require('dotenv').config();
const SupabaseCategory = require('./models/SupabaseCategory');
const SupabaseSubCategory = require('./models/SupabaseSubCategory');
const SupabaseSubSubCategory = require('./models/SupabaseSubSubCategory');

async function testCategoriesAPI() {
  try {
    console.log('🔍 Testing categories API data fetch...');
    
    // Test categories
    console.log('📂 Fetching categories...');
    const categoriesResult = await SupabaseCategory.find({ is_active: true });
    const categories = categoriesResult.data || [];
    console.log(`✅ Found ${categories.length} categories`);
    
    // Test subcategories
    console.log('📂 Fetching subcategories...');
    const subcategoriesResult = await SupabaseSubCategory.find({ is_active: true });
    const subcategories = subcategoriesResult.data || [];
    console.log(`✅ Found ${subcategories.length} subcategories`);
    
    // Test sub-subcategories
    console.log('📂 Fetching sub-subcategories...');
    const subSubcategoriesResult = await SupabaseSubSubCategory.find({ is_active: true });
    const subSubcategories = subSubcategoriesResult.data || [];
    console.log(`✅ Found ${subSubcategories.length} sub-subcategories`);
    
    // Build hierarchy for first category
    if (categories.length > 0) {
      const firstCategory = categories[0];
      console.log(`\n🏗️ Building hierarchy for category: ${firstCategory.name}`);
      
      const categorySubcategories = subcategories.filter(sub => sub.category_id === firstCategory.id);
      console.log(`📋 Found ${categorySubcategories.length} subcategories for ${firstCategory.name}`);
      
      if (categorySubcategories.length > 0) {
        const firstSubcategory = categorySubcategories[0];
        console.log(`📋 First subcategory: ${firstSubcategory.name}`);
        
        const subSubcategoriesForSub = subSubcategories.filter(subSub => subSub.subcategory_id === firstSubcategory.id);
        console.log(`📋 Found ${subSubcategoriesForSub.length} sub-subcategories for ${firstSubcategory.name}`);
      }
    }
    
    // Build full hierarchy
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
    
    console.log('\n📊 Final hierarchy summary:');
    categoriesWithSubcategories.forEach(cat => {
      console.log(`  ${cat.name}: ${cat.subcategories.length} subcategories`);
      cat.subcategories.forEach(sub => {
        console.log(`    - ${sub.name}: ${sub.sub_subcategories.length} sub-subcategories`);
      });
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

testCategoriesAPI().then(success => {
  console.log(success ? '🎉 Categories API test completed successfully' : '💥 Categories API test failed');
  process.exit(success ? 0 : 1);
});
