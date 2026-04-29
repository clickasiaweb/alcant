// Test script to check category API
const API_BASE_URL = 'https://alcant-backend.vercel.app/api';

async function testCategoryAPI() {
  console.log('🧪 Testing Category API...');
  
  try {
    // Test 1: Get all products
    console.log('\n📦 Testing GET /products');
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log('Products response:', productsData);
    console.log('Number of products:', productsData.data?.length || 0);
    
    // Test 2: Get products with category filter
    console.log('\n📦 Testing GET /products?categoryId=f009ca1d-9f5d-4bf3-81f7-b246d105d1be');
    const categoryResponse = await fetch(`${API_BASE_URL}/products?categoryId=f009ca1d-9f5d-4bf3-81f7-b246d105d1be`);
    const categoryData = await categoryResponse.json();
    console.log('Category filter response:', categoryData);
    console.log('Products with category filter:', categoryData.data?.length || 0);
    
    // Test 3: Get products with both category and subcategory filters
    console.log('\n📦 Testing GET /products?categoryId=f009ca1d-9f5d-4bf3-81f7-b246d105d1be&subCategoryId=3207f43f-b904-486e-b2e5-9c6230eb7793');
    const subCategoryResponse = await fetch(`${API_BASE_URL}/products?categoryId=f009ca1d-9f5d-4bf3-81f7-b246d105d1be&subCategoryId=3207f43f-b904-486e-b2e5-9c6230eb7793`);
    const subCategoryData = await subCategoryResponse.json();
    console.log('Subcategory filter response:', subCategoryData);
    console.log('Products with subcategory filter:', subCategoryData.data?.length || 0);
    
    // Test 4: Check sample product structure
    if (productsData.data && productsData.data.length > 0) {
      console.log('\n🔍 Sample product structure:');
      console.log(JSON.stringify(productsData.data[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
}

testCategoryAPI();
