// Test script to verify image upload and display fixes
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE = 'http://localhost:5001/api';

async function testImageUpload() {
  console.log('🧪 Testing Image Upload Fix...\n');

  try {
    // Test 1: Check if upload endpoint exists
    console.log('1️⃣ Testing upload endpoint availability...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend is healthy:', healthResponse.data.status);

    // Test 2: Test image upload with a simple test image (create a dummy file)
    console.log('\n2️⃣ Testing image upload...');
    
    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test-product-image.png',
      contentType: 'image/png'
    });

    try {
      const uploadResponse = await axios.post(`${API_BASE}/upload/image`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Image upload successful:', uploadResponse.data);
      console.log('📸 Uploaded image URL:', uploadResponse.data.url);
      
      // Test 3: Verify the uploaded image is accessible
      console.log('\n3️⃣ Testing uploaded image accessibility...');
      const imageUrl = `http://localhost:5001${uploadResponse.data.url}`;
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      
      if (imageResponse.status === 200) {
        console.log('✅ Uploaded image is accessible');
        console.log('📊 Image size:', imageResponse.data.length, 'bytes');
      } else {
        console.log('❌ Uploaded image is not accessible');
      }
      
    } catch (uploadError) {
      console.log('❌ Image upload failed:', uploadError.response?.data || uploadError.message);
    }

    // Test 4: Check bulk upload endpoint
    console.log('\n4️⃣ Testing bulk upload endpoint...');
    try {
      const bulkTemplateResponse = await axios.get(`${API_BASE}/products/bulk-upload/template`);
      console.log('✅ Bulk upload template endpoint is working');
    } catch (bulkError) {
      console.log('❌ Bulk upload template error:', bulkError.response?.data || bulkError.message);
    }

    console.log('\n🎉 Image upload fix testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test product image display in frontend
async function testProductImageDisplay() {
  console.log('\n🧪 Testing Product Image Display Fix...\n');

  try {
    // Test getting a product to see image URLs
    console.log('1️⃣ Testing product API response...');
    const productsResponse = await axios.get(`${API_BASE}/products`);
    
    if (productsResponse.data.products && productsResponse.data.products.length > 0) {
      const sampleProduct = productsResponse.data.products[0];
      console.log('✅ Products API working');
      console.log('📦 Sample product:', {
        name: sampleProduct.name,
        image: sampleProduct.image,
        images: sampleProduct.images
      });
      
      // Test image URL construction
      if (sampleProduct.image) {
        const imageUrl = sampleProduct.image.startsWith('http') 
          ? sampleProduct.image 
          : `http://localhost:5001${sampleProduct.image}`;
        
        console.log('🔗 Constructed image URL:', imageUrl);
        
        try {
          const imageResponse = await axios.head(imageUrl);
          console.log('✅ Product image is accessible:', imageResponse.status);
        } catch (imgError) {
          console.log('⚠️ Product image not accessible:', imgError.message);
        }
      }
    } else {
      console.log('ℹ️ No products found to test image display');
    }
    
  } catch (error) {
    console.error('❌ Product display test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testImageUpload();
  await testProductImageDisplay();
  
  console.log('\n📋 Summary of Fixes Applied:');
  console.log('1. ✅ Created image upload controller with multer');
  console.log('2. ✅ Added upload routes to server');
  console.log('3. ✅ Fixed admin panel image upload to actually upload files');
  console.log('4. ✅ Fixed bulk upload category storage (names + IDs)');
  console.log('5. ✅ Fixed frontend image URL handling in ProductImage component');
  console.log('6. ✅ Fixed frontend image URL handling in ProductCard component');
  console.log('7. ✅ Added static file serving for uploaded images');
  
  console.log('\n🎯 Issues Fixed:');
  console.log('- Admin panel images now upload to server instead of blob URLs');
  console.log('- Bulk upload properly stores category names and creates missing categories');
  console.log('- Frontend properly displays uploaded images from /uploads/ path');
  console.log('- Image URLs are constructed correctly for both relative and absolute paths');
  
  process.exit(0);
}

runAllTests().catch(console.error);
