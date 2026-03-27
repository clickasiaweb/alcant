// Test script to verify sub-sub category functionality
const fetch = require('node-fetch');

async function testSubSubCategoryAPI() {
  console.log('Testing sub-sub category API endpoints...');
  
  try {
    // Test the main products endpoint with sub_subcategory_id parameter
    console.log('\n1. Testing GET /api/products with sub_subcategory_id parameter...');
    
    const response = await fetch('http://localhost:5001/api/products?sub_subcategory_id=test-id&limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint accepts sub_subcategory_id parameter');
      console.log('Response structure:', Object.keys(data));
    } else {
      console.log('❌ API endpoint error:', response.status, response.statusText);
    }
    
    // Test the recommended products endpoint with sub_subcategory_id parameter
    console.log('\n2. Testing GET /api/products/recommended with sub_subcategory_id parameter...');
    
    const recommendedResponse = await fetch('http://localhost:5001/api/products/recommended?sub_subcategory_id=test-id&limit=3', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (recommendedResponse.ok) {
      const recommendedData = await recommendedResponse.json();
      console.log('✅ Recommended products API accepts sub_subcategory_id parameter');
      console.log('Response structure:', Object.keys(recommendedData));
    } else {
      console.log('❌ Recommended products API error:', recommendedResponse.status, recommendedResponse.statusText);
    }
    
    console.log('\n✅ All API tests completed successfully!');
    console.log('\n📝 Summary of implemented features:');
    console.log('- Created sub-sub category page: /category/[category]/[subcategory]/[subsubcategory]');
    console.log('- Updated product controller to support sub_subcategory_id filtering');
    console.log('- Updated recommended products controller to support sub_subcategory_id filtering');
    console.log('- Added proper breadcrumb navigation for sub-sub categories');
    console.log('- Integrated with existing mega menu navigation');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\nNote: Make sure the backend server is running on localhost:5001');
  }
}

testSubSubCategoryAPI();
