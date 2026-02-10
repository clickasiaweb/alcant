// Test script to verify database setup and API endpoints
const { supabase, supabaseService } = require('../config/supabase');

console.log('🔍 Testing Database Connection and Data\n');

async function testDatabase() {
  try {
    console.log('1. Testing categories table...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) throw catError;
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`));

    console.log('\n2. Testing subcategories table...');
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('*');
    
    if (subError) throw subError;
    console.log(`✅ Found ${subcategories.length} subcategories`);
    subcategories.forEach(sub => console.log(`   - ${sub.name} (${sub.slug})`));

    console.log('\n3. Testing sub_subcategories table...');
    const { data: subSubcategories, error: subSubError } = await supabase
      .from('sub_subcategories')
      .select('*');
    
    if (subSubError) throw subSubError;
    console.log(`✅ Found ${subSubcategories.length} sub-subcategories`);
    subSubcategories.forEach(subSub => console.log(`   - ${subSub.name} (${subSub.slug})`));

    console.log('\n4. Testing categories_with_subcategories view...');
    const { data: viewData, error: viewError } = await supabase
      .from('categories_with_subcategories')
      .select('*');
    
    if (viewError) throw viewError;
    console.log(`✅ View returned ${viewData.length} categories`);
    viewData.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.subcategories ? cat.subcategories.length : 0} subcategories`);
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach(sub => {
          console.log(`     - ${sub.name}: ${sub.sub_subcategories ? sub.sub_subcategories.length : 0} sub-subcategories`);
        });
      }
    });

    console.log('\n5. Testing full_categories_hierarchy view...');
    const { data: hierarchyData, error: hierarchyError } = await supabase
      .from('full_categories_hierarchy')
      .select('*');
    
    if (hierarchyError) throw hierarchyError;
    console.log(`✅ Hierarchy view returned ${hierarchyData.length} total items`);
    
    const grouped = hierarchyData.reduce((acc, item) => {
      if (!acc[item.category_name]) {
        acc[item.category_name] = { subcategories: {}, subSubcategories: [] };
      }
      if (item.subcategory_name) {
        acc[item.category_name].subcategories[item.subcategory_name] = true;
      }
      if (item.sub_subcategory_name) {
        acc[item.category_name].subSubcategories.push(item.sub_subcategory_name);
      }
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([category, data]) => {
      const subCount = Object.keys(data.subcategories).length;
      const subSubCount = data.subSubcategories.length;
      console.log(`   - ${category}: ${subCount} subcategories, ${subSubCount} sub-subcategories`);
    });

    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testing API Endpoints\n');
  
  try {
    // Test if backend server is running
    const baseUrl = 'http://localhost:5000/api';
    
    console.log('Testing GET /api/categories/all/with-subcategories...');
    const response = await fetch(`${baseUrl}/categories/all/with-subcategories`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API returned ${data.data ? data.data.length : 0} categories`);
    
    if (data.data && data.data.length > 0) {
      data.data.forEach(cat => {
        const subCount = cat.subcategories ? cat.subcategories.length : 0;
        console.log(`   - ${cat.name}: ${subCount} subcategories`);
      });
    }
    
    console.log('\n🎉 API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure your backend server is running on port 5000');
  }
}

// Run tests
async function runTests() {
  await testDatabase();
  await testAPIEndpoints();
}

runTests();
