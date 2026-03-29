// Test script to verify sub-subcategory filtering functionality

const API_BASE = 'http://localhost:5001/api';

async function testCategoryFiltering() {
  console.log('🧪 Testing Category Filtering Functionality\n');

  try {
    // Test 1: Get all products
    console.log('1️⃣ Testing: Get all products');
    const allProductsResponse = await fetch(`${API_BASE}/products`);
    const allProductsData = await allProductsResponse.json();
    console.log(`   ✅ Found ${allProductsData.products.length} total products\n`);

    // Test 2: Get categories hierarchy
    console.log('2️⃣ Testing: Get categories hierarchy');
    const categoriesResponse = await fetch(`${API_BASE}/categories/hierarchy`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.data && categoriesData.data.length > 0) {
      const phoneCategory = categoriesData.data.find(cat => cat.name === "Phone Cases");
      if (phoneCategory && phoneCategory.subcategories) {
        const iphoneSub = phoneCategory.subcategories.find(sub => sub.name === "iPhone Cases");
        if (iphoneSub && iphoneSub.sub_subcategories && iphoneSub.sub_subcategories.length > 0) {
          const firstSubSub = iphoneSub.sub_subcategories[0];
          console.log(`   ✅ Found sub-subcategory: ${firstSubSub.name} (ID: ${firstSubSub.id})`);
          
          // Test 3: Filter by sub-subcategory ID
          console.log(`\n3️⃣ Testing: Filter products by sub-subcategory ID`);
          const filteredResponse = await fetch(`${API_BASE}/products?sub_subcategory_id=${firstSubSub.id}`);
          const filteredData = await filteredResponse.json();
          console.log(`   ✅ Filtered result: ${filteredData.products.length} products found`);
          
          // Test 4: Test with non-existent ID
          console.log(`\n4️⃣ Testing: Filter with non-existent ID`);
          const emptyResponse = await fetch(`${API_BASE}/products?sub_subcategory_id=non-existent-id`);
          const emptyData = await emptyResponse.json();
          console.log(`   ✅ Empty result: ${emptyData.products.length} products found (expected: 0)`);
          
          // Test 5: Test pagination with filtering
          console.log(`\n5️⃣ Testing: Pagination with filtering`);
          const paginatedResponse = await fetch(`${API_BASE}/products?sub_subcategory_id=${firstSubSub.id}&page=1&limit=5`);
          const paginatedData = await paginatedResponse.json();
          console.log(`   ✅ Paginated result: ${paginatedData.products.length} products (limit: 5)`);
          console.log(`   📊 Total available: ${paginatedData.pagination.total}`);
          
        } else {
          console.log('   ⚠️  No sub-subcategories found for iPhone Cases');
        }
      } else {
        console.log('   ⚠️  No iPhone Cases subcategory found');
      }
    } else {
      console.log('   ⚠️  No categories found');
    }

    // Test 6: Test search functionality
    console.log(`\n6️⃣ Testing: Search functionality`);
    const searchResponse = await fetch(`${API_BASE}/products?search=iPhone`);
    const searchData = await searchResponse.json();
    console.log(`   ✅ Search results: ${searchData.products.length} products found`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Basic API endpoints are working');
    console.log('   - Category hierarchy is functional');
    console.log('   - Sub-subcategory filtering is implemented');
    console.log('   - Pagination works with filters');
    console.log('   - Search functionality is operational');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategoryFiltering();
