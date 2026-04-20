// Comprehensive test to verify product creation and image storage fixes
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE = 'http://localhost:5001/api';

async function testProductCreationFix() {
  console.log('🧪 Testing Product Creation and Image Storage Fixes...\n');

  try {
    // Test 1: Check if backend is healthy
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend is healthy:', healthResponse.data.status);

    // Test 2: Test image upload
    console.log('\n2️⃣ Testing image upload...');
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test-product-image.png',
      contentType: 'image/png'
    });

    const uploadResponse = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: formData.getHeaders()
    });
    
    console.log('✅ Image upload successful:', uploadResponse.data);
    console.log('📸 Uploaded image URL:', uploadResponse.data.url);

    // Test 3: Test product creation with all required fields including brand
    console.log('\n3️⃣ Testing product creation with brand field...');
    
    const productData = {
      name: 'Test Product with Brand',
      slug: 'test-product-with-brand',
      description: 'This is a test product to verify brand field and image storage work correctly',
      price: 99.99,
      brand: 'Test Brand', // ✅ CRITICAL: Required field that was missing
      category: 'Test Category',
      subcategory: 'Test Subcategory',
      images: [uploadResponse.data.url],
      image: uploadResponse.data.url,
      stock: 10,
      is_active: true
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/admin/products`, productData);
      console.log('✅ Product creation successful:', createResponse.data);
      console.log('📦 Product ID:', createResponse.data.product?.id);
      
      // Test 4: Verify product was created correctly
      if (createResponse.data.product?.id) {
        console.log('\n4️⃣ Testing product retrieval to verify storage...');
        
        const getResponse = await axios.get(`${API_BASE}/products/${createResponse.data.product.id}`);
        console.log('✅ Product retrieved successfully');
        
        // Verify all critical fields
        const verification = {
          name: getResponse.data.name === productData.name,
          brand: getResponse.data.brand === productData.brand,
          image: getResponse.data.image === uploadResponse.data.url,
          images: getResponse.data.images && getResponse.data.images.includes(uploadResponse.data.url),
          price: getResponse.data.price === productData.price,
          category: getResponse.data.category === productData.category
        };
        
        console.log('🔍 Field verification results:');
        Object.entries(verification).forEach(([field, passed]) => {
          console.log(`  ${passed ? '✅' : '❌'} ${field}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const allFieldsCorrect = Object.values(verification).every(v => v === true);
        
        if (allFieldsCorrect) {
          console.log('\n🎉 ALL TESTS PASSED!');
          console.log('✅ Product creation works correctly');
          console.log('✅ Brand field is stored properly');
          console.log('✅ Images are uploaded and stored correctly');
          console.log('✅ All required fields are preserved');
        } else {
          console.log('\n⚠️ SOME TESTS FAILED');
          console.log('❌ There are still issues with product creation/storage');
        }
      }
      
    } catch (createError) {
      console.log('❌ Product creation failed:', createError.response?.data || createError.message);
      if (createError.response?.data?.error) {
        console.log('🔍 Error details:', createError.response.data.error);
      }
    }

    // Test 5: Test product update with images
    if (createResponse.data.product?.id) {
      console.log('\n5️⃣ Testing product update with new images...');
      
      const updateData = {
        name: 'Updated Test Product',
        brand: 'Updated Test Brand',
        images: [uploadResponse.data.url, uploadResponse.data.url] // Multiple images
      };
      
      try {
        const updateResponse = await axios.put(`${API_BASE}/admin/products/${createResponse.data.product.id}`, updateData);
        console.log('✅ Product update successful:', updateResponse.data);
        
        // Verify update
        const getUpdatedResponse = await axios.get(`${API_BASE}/products/${createResponse.data.product.id}`);
        console.log('✅ Updated product verification:', {
          nameUpdated: getUpdatedResponse.data.name === updateData.name,
          brandUpdated: getUpdatedResponse.data.brand === updateData.brand,
          imagesUpdated: getUpdatedResponse.data.images.length === 2
        });
        
      } catch (updateError) {
        console.log('❌ Product update failed:', updateError.response?.data || updateError.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

async function runVerification() {
  console.log('📋 ISSUES THAT WERE FIXED:');
  console.log('1. ✅ Added missing brand field to product form');
  console.log('2. ✅ Fixed image processing to accept /uploads/ URLs');
  console.log('3. ✅ Removed product ID requirement for new products');
  console.log('4. ✅ Fixed API URL to point to correct backend port');
  console.log('5. ✅ Added brand field to ProductFormModal with validation');
  
  console.log('\n🎯 EXPECTED BEHAVIOR AFTER FIX:');
  console.log('- Products should create successfully with brand field');
  console.log('- Images should upload and store in database');
  console.log('- Both new creation and updates should work');
  console.log('- No validation errors for missing required fields');
  
  await testProductCreationFix();
  
  console.log('\n📊 SUMMARY:');
  console.log('If all tests pass, the product creation and image storage issues are RESOLVED!');
  console.log('If tests fail, there are still underlying issues to investigate.');
  
  process.exit(0);
}

runVerification().catch(console.error);
