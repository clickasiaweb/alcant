// Test script for image upload functionality
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testImageUpload() {
  try {
    console.log('Testing image upload API...');
    
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
    
    // Create form data
    const form = new FormData();
    form.append('image', testImageData, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    console.log('Sending image upload request...');
    
    const response = await fetch('http://localhost:5001/api/upload/image', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('Image upload test: PASSED');
      console.log('Upload result:', JSON.stringify(result, null, 2));
      
      // Test if the uploaded image is accessible
      const imageUrl = `http://localhost:5001${result.url}`;
      console.log('Testing image accessibility:', imageUrl);
      
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        console.log('Image accessibility test: PASSED');
      } else {
        console.log('Image accessibility test: FAILED');
        console.log('Status:', imageResponse.status);
      }
      
      return true;
    } else {
      console.log('Image upload test: FAILED');
      console.log('Error:', result.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('Image upload test: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function testProductImageUpdate() {
  try {
    console.log('Testing product image update workflow...');
    
    // First, get an existing product
    const productsResponse = await fetch('http://localhost:5001/api/products');
    const productsData = await productsResponse.json();
    const products = productsData.products || productsData.data || [];
    
    if (products.length === 0) {
      console.log('No products found for testing');
      return false;
    }
    
    const testProduct = products[0];
    console.log('Testing with product:', testProduct.name);
    
    // Upload a test image
    const testImageData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0x99, 0x01, 0x01, 0x01, 0x00, 0x00,
      0xFE, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82
    ]);
    
    const form = new FormData();
    form.append('image', testImageData, {
      filename: 'test-product-update.png',
      contentType: 'image/png'
    });
    
    const uploadResponse = await fetch('http://localhost:5001/api/upload/image', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const uploadResult = await uploadResponse.json();
    
    if (uploadResponse.ok && uploadResult.success) {
      console.log('Test image uploaded successfully');
      
      // Now test updating the product with the new image
      const updateData = {
        images: [uploadResult.url],
        image: uploadResult.url
      };
      
      const updateResponse = await fetch(`http://localhost:5001/api/products/${testProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const updateResult = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('Product image update test: PASSED');
        console.log('Updated product images:', updateResult.images);
        return true;
      } else {
        console.log('Product image update test: FAILED');
        console.log('Error:', updateResult.message);
        return false;
      }
    } else {
      console.log('Failed to upload test image');
      return false;
    }
  } catch (error) {
    console.error('Product image update test: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('IMAGE UPLOAD & UPDATE TESTS');
  console.log('='.repeat(60));
  
  const uploadTest = await testImageUpload();
  console.log();
  const updateTest = await testProductImageUpdate();
  
  console.log('='.repeat(60));
  console.log('TEST SUMMARY:');
  console.log(`Image Upload API: ${uploadTest ? 'PASSED' : 'FAILED'}`);
  console.log(`Product Image Update: ${updateTest ? 'PASSED' : 'FAILED'}`);
  
  if (uploadTest && updateTest) {
    console.log('All tests PASSED! Image functionality should work correctly.');
  } else {
    console.log('Some tests FAILED. Please check the backend configuration.');
  }
  console.log('='.repeat(60));
}

// Check if node-fetch is available, if not use global fetch
if (typeof fetch === 'undefined') {
  try {
    global.fetch = require('node-fetch');
    global.FormData = require('form-data');
  } catch (error) {
    console.error('Please install node-fetch and form-data: npm install node-fetch form-data');
    process.exit(1);
  }
}

runTests();
