// Simple test to bypass frontend and check API directly
const fetch = require('node-fetch');

async function testFeaturedProductsAPI() {
  try {
    console.log('🔄 Testing featured products API directly...');
    
    const response = await fetch('https://alcant-backend.vercel.app/api/products/featured', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 Featured products response:', data);
    
    // Check if products array exists and has items
    if (data && Array.isArray(data)) {
      console.log('✅ API Response type: Direct array');
      console.log('📦 Product count:', data.length);
      
      if (data.length > 0) {
        console.log('🎉 Featured products found:');
        data.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.name} (featured: ${product.featured})`);
        });
      }
    } else if (data.products && Array.isArray(data.products)) {
      console.log('✅ API Response type: data.products array');
      console.log('📦 Product count:', data.products.length);
      
      if (data.products.length > 0) {
        console.log('🎉 Featured products found:');
        data.products.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.name} (featured: ${product.featured})`);
        });
      }
    } else {
      console.log('❌ No products found in response');
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testFeaturedProductsAPI();
