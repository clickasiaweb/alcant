// Test script to verify product API endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testProductAPIs() {
  console.log('Testing Product API Endpoints...\n');
  
  try {
    // Test 1: Get all products
    console.log('1. Testing GET /products...');
    const allProducts = await axios.get(`${API_BASE_URL}/products`);
    console.log(`✓ Found ${allProducts.data.products?.length || 0} products`);
    
    // Test 2: Get new products
    console.log('\n2. Testing GET /products/new...');
    const newProducts = await axios.get(`${API_BASE_URL}/products/new`);
    console.log(`✓ Found ${newProducts.data.products?.length || 0} new products`);
    
    // Test 3: Get featured products
    console.log('\n3. Testing GET /products/featured...');
    const featuredProducts = await axios.get(`${API_BASE_URL}/products/featured`);
    console.log(`✓ Found ${featuredProducts.data.products?.length || 0} featured products`);
    
    // Test 4: Get categories
    console.log('\n4. Testing GET /products/categories...');
    const categories = await axios.get(`${API_BASE_URL}/products/categories`);
    console.log(`✓ Found categories: ${Object.keys(categories.data.categories || {}).join(', ')}`);
    
    // Test 5: Get product by slug (if we have products)
    if (allProducts.data.products && allProducts.data.products.length > 0) {
      const firstProduct = allProducts.data.products[0];
      const slug = firstProduct.slug || firstProduct.name.toLowerCase().replace(/\s+/g, '-');
      
      console.log(`\n5. Testing GET /products/slug/${slug}...`);
      try {
        const productBySlug = await axios.get(`${API_BASE_URL}/products/slug/${slug}`);
        console.log(`✓ Found product: ${productBySlug.data.name}`);
      } catch (error) {
        console.log(`✗ Product not found for slug: ${slug}`);
      }
    }
    
    console.log('\n✅ All API tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ API Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
testProductAPIs();
