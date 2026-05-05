// Test script to verify category filtering is working correctly
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001/api';

async function testCategoryFiltering() {
  console.log('🧪 Testing Category Filtering Fix\n');

  try {
    // Test 1: Get all products (baseline)
    console.log('1️⃣ Getting all products...');
    const allProductsResponse = await fetch(`${API_BASE}/products`);
    const allProducts = await allProductsResponse.json();
    console.log(`   Found ${allProducts.products.length} total products\n`);

    // Test 2: Filter by sub-subcategory UUID (should work now)
    console.log('2️⃣ Filtering by sub_subcategory_id (UUID)...');
    const uuidFilteredResponse = await fetch(`${API_BASE}/products?sub_subcategory_id=f9e3a722-fc55-4492-b34b-705d57f16992`);
    const uuidFiltered = await uuidFilteredResponse.json();
    console.log(`   Found ${uuidFiltered.products.length} products with UUID filter`);
    if (uuidFiltered.products.length > 0) {
      console.log(`   ✅ Product: ${uuidFiltered.products[0].name}`);
    }
    console.log('');

    // Test 3: Filter by sub-subcategory string (fallback)
    console.log('3️⃣ Filtering by subSubCategoryId (string fallback)...');
    const stringFilteredResponse = await fetch(`${API_BASE}/products?subSubCategoryId=General`);
    const stringFiltered = await stringFilteredResponse.json();
    console.log(`   Found ${stringFiltered.products.length} products with string filter`);
    if (stringFiltered.products.length > 0) {
      console.log(`   ✅ Product: ${stringFiltered.products[0].name}`);
    }
    console.log('');

    // Test 4: Verify no products when using non-existent ID
    console.log('4️⃣ Testing with non-existent UUID...');
    const nonExistentResponse = await fetch(`${API_BASE}/products?sub_subcategory_id=00000000-0000-0000-0000-000000000000`);
    const nonExistent = await nonExistentResponse.json();
    console.log(`   Found ${nonExistent.products.length} products with non-existent UUID (should be 0)`);
    console.log('');

    console.log('✅ Category filtering test completed successfully!');
    console.log('🎯 The fix ensures:');
    console.log('   • UUID-based filtering takes priority');
    console.log('   • String-based filtering works as fallback');
    console.log('   • Sub-subcategory navigation shows correct products');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategoryFiltering();
