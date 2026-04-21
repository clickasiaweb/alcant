// Test script to verify API endpoints are working
const fs = require('fs');
const path = require('path');

// Test 1: Check if backend is running
async function testBackendHealth() {
  try {
    const response = await fetch('http://localhost:5001/api/health');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend Health Check: PASSED');
      console.log('   Status:', data.status);
      console.log('   Database:', data.database?.status || 'Unknown');
      return true;
    } else {
      console.log('❌ Backend Health Check: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend Health Check: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 2: Test image upload endpoint
async function testImageUpload() {
  try {
    console.log('Testing image upload endpoint...');
    
    // Create a simple test image (1x1 PNG)
    const testImageData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // bit depth, color type
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0x99, 0x01, 0x01, 0x01, 0x00, 0x00,
      0xFE, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // image data
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
      0xAE, 0x42, 0x60, 0x82
    ]);
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', testImageData, {
      filename: 'test-upload.png',
      contentType: 'image/png'
    });
    
    const response = await fetch('http://localhost:5001/api/upload/image', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Image Upload Test: PASSED');
      console.log('   Uploaded URL:', result.url);
      console.log('   Full URL:', `http://localhost:5001${result.url}`);
      
      // Test if the uploaded image is accessible
      const imageUrl = `http://localhost:5001${result.url}`;
      const imageResponse = await fetch(imageUrl);
      
      if (imageResponse.ok) {
        console.log('✅ Image Accessibility Test: PASSED');
        console.log('   Image is accessible at:', imageUrl);
      } else {
        console.log('❌ Image Accessibility Test: FAILED');
        console.log('   Status:', imageResponse.status);
      }
      
      return { success: true, url: result.url, fullUrl: imageUrl };
    } else {
      console.log('❌ Image Upload Test: FAILED');
      console.log('   Error:', result.message || 'Unknown error');
      console.log('   Response:', JSON.stringify(result, null, 2));
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.log('❌ Image Upload Test: FAILED');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 3: Test products API
async function testProductsAPI() {
  try {
    console.log('Testing products API...');
    
    const response = await fetch('http://localhost:5001/api/products');
    const data = await response.json();
    
    if (response.ok) {
      const products = data.products || data.data || [];
      console.log('✅ Products API Test: PASSED');
      console.log('   Found products:', products.length);
      
      if (products.length > 0) {
        const firstProduct = products[0];
        console.log('   First product:', firstProduct.name || firstProduct.title);
        console.log('   Has images:', firstProduct.images ? firstProduct.images.length : 0);
        console.log('   Main image:', firstProduct.image || 'None');
      }
      
      return true;
    } else {
      console.log('❌ Products API Test: FAILED');
      console.log('   Error:', data.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log('❌ Products API Test: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 4: Test categories API
async function testCategoriesAPI() {
  try {
    console.log('Testing categories API...');
    
    const response = await fetch('http://localhost:5001/api/categories/hierarchy');
    const data = await response.json();
    
    if (response.ok) {
      const categories = data.data || [];
      console.log('✅ Categories API Test: PASSED');
      console.log('   Found categories:', categories.length);
      
      if (categories.length > 0) {
        const firstCategory = categories[0];
        console.log('   First category:', firstCategory.name);
        console.log('   Has subcategories:', firstCategory.subcategories ? firstCategory.subcategories.length : 0);
      }
      
      return true;
    } else {
      console.log('❌ Categories API Test: FAILED');
      console.log('   Error:', data.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log('❌ Categories API Test: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('TESTING IMAGE UPLOAD FIXES');
  console.log('='.repeat(60));
  
  const healthTest = await testBackendHealth();
  console.log();
  
  if (!healthTest) {
    console.log('❌ Backend is not running. Please start the backend server first.');
    console.log('   Run: npm start in the backend directory');
    return;
  }
  
  const uploadTest = await testImageUpload();
  console.log();
  
  const productsTest = await testProductsAPI();
  console.log();
  
  const categoriesTest = await testCategoriesAPI();
  console.log();
  
  console.log('='.repeat(60));
  console.log('TEST SUMMARY:');
  console.log(`Backend Health: ${healthTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Image Upload: ${uploadTest.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Products API: ${productsTest ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Categories API: ${categoriesTest ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = healthTest && uploadTest.success && productsTest && categoriesTest;
  console.log(`Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log();
    console.log('🎉 All API endpoints are working correctly!');
    console.log('📝 You can now test the admin panel frontend.');
    console.log('🌐 Open: http://localhost:3001');
  }
  
  console.log('='.repeat(60));
}

// Check for required modules
try {
  require('form-data');
  require('node-fetch');
} catch (error) {
  console.log('❌ Missing required modules. Please install:');
  console.log('   npm install form-data node-fetch');
  process.exit(1);
}

// Set up global fetch if not available
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

runAllTests();
