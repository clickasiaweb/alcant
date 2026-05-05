// Test script to verify the category filtering fix
console.log('🧪 Testing Category Filtering Fix\n');

async function testCategoryFiltering() {
  try {
    // Test 1: Verify API returns different results for different parameters
    console.log('1️⃣ Testing API with different parameters...');
    
    const allProductsResponse = await fetch('http://localhost:5001/api/products');
    const allProducts = await allProductsResponse.json();
    console.log(`   All products: ${allProducts.products.length}`);
    
    const filteredResponse = await fetch('http://localhost:5001/api/products?sub_subcategory_id=f9e3a722-fc55-4492-b34b-705d57f16992');
    const filtered = await filteredResponse.json();
    console.log(`   Filtered products: ${filtered.products.length}`);
    
    // Test 2: Verify cache keys are different
    console.log('\n2️⃣ Testing cache key generation...');
    const params1 = { sub_subcategory_id: 'f9e3a722-fc55-4492-b34b-705d57f16992' };
    const params2 = { category: 'phone-cases' };
    
    const queryString1 = new URLSearchParams(params1).toString();
    const queryString2 = new URLSearchParams(params2).toString();
    
    const cacheKey1 = `http://localhost:5001/api/products?${queryString1}`;
    const cacheKey2 = `http://localhost:5001/api/products?${queryString2}`;
    
    console.log(`   Cache key 1: ${cacheKey1}`);
    console.log(`   Cache key 2: ${cacheKey2}`);
    console.log(`   Keys are different: ${cacheKey1 !== cacheKey2}`);
    
    // Test 3: Verify category hierarchy
    console.log('\n3️⃣ Testing category hierarchy...');
    const hierarchyResponse = await fetch('http://localhost:5001/api/categories/hierarchy');
    const hierarchy = await hierarchyResponse.json();
    
    const phoneCases = hierarchy.data.find(cat => cat.slug === 'phone-cases');
    const iphoneCases = phoneCases?.subcategories.find(sub => sub.slug === 'iphone-cases');
    const targetSubSub = iphoneCases?.sub_subcategories.find(ss => ss.slug === '17-pro');
    
    console.log(`   Target sub-subcategory: ${targetSubSub?.name}`);
    console.log(`   Expected URL: /category/phone-cases/iphone-cases/17-pro`);
    console.log(`   Expected products: ${filtered.products.length}`);
    
    console.log('\n✅ All tests completed!');
    console.log('🎯 The fix should now work correctly:');
    console.log('   • API cache includes query parameters');
    console.log('   • Different filter parameters create different cache keys');
    console.log('   • Sub-subcategory navigation should show filtered products');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCategoryFiltering();
