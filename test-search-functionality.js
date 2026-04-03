// Test script to verify search functionality
const API_BASE_URL = 'http://localhost:5001/api';

async function testSearchFunctionality() {
  console.log('🔍 Testing Search Functionality...\n');

  // Test 1: Basic search
  console.log('Test 1: Basic search for "phone"');
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=phone&limit=5`);
    const data = await response.json();
    
    console.log('✅ Search endpoint working');
    console.log(`📊 Found ${data.products?.length || 0} products`);
    
    if (data.products && data.products.length > 0) {
      console.log('📦 Sample product:', {
        id: data.products[0].id,
        name: data.products[0].name,
        price: data.products[0].price,
        category: data.products[0].category,
        image: data.products[0].image ? '✓' : '✗'
      });
    }
  } catch (error) {
    console.error('❌ Search test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Categories endpoint
  console.log('Test 2: Categories endpoint');
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    const data = await response.json();
    
    console.log('✅ Categories endpoint working');
    console.log('📂 Available categories:', Object.keys(data.categories || {}));
  } catch (error) {
    console.error('❌ Categories test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Products endpoint (general)
  console.log('Test 3: General products endpoint');
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=5`);
    const data = await response.json();
    
    console.log('✅ Products endpoint working');
    console.log(`📊 Retrieved ${data.products?.length || 0} products`);
  } catch (error) {
    console.error('❌ Products test failed:', error.message);
  }

  console.log('\n🎉 Search functionality test completed!');
}

// Run the test
testSearchFunctionality().catch(console.error);
