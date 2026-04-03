// Test script to verify featured products API
const fetch = require('node-fetch');

async function testFeaturedProducts() {
  try {
    console.log('Testing featured products API...');
    
    const response = await fetch('http://localhost:5001/api/products/featured?limit=8');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Products count:', data.products?.length || 0);
    
    if (data.products && data.products.length > 0) {
      console.log('First product:', {
        name: data.products[0].name,
        featured: data.products[0].featured,
        price: data.products[0].price,
        image: data.products[0].image
      });
      
      console.log('All products featured status:');
      data.products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}: featured=${p.featured}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testFeaturedProducts();
