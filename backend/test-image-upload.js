/**
 * Test script to verify product image upload functionality
 * Tests both the upload endpoint and image URL handling
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const API_URL = 'http://localhost:5001';

async function testImageUpload() {
  console.log('🧪 Testing Product Image Upload Functionality\n');

  try {
    // Test 1: Check if upload endpoint is accessible
    console.log('1️⃣ Testing upload endpoint accessibility...');
    const healthResponse = await fetch(`${API_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend health check:', healthData.status);

    // Test 2: Create a test image file (simple 1x1 pixel PNG)
    console.log('\n2️⃣ Creating test image...');
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a simple 1x1 PNG (base64 encoded)
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const pngBuffer = Buffer.from(pngBase64, 'base64');
    fs.writeFileSync(testImagePath, pngBuffer);
    console.log('✅ Test image created:', testImagePath);

    // Test 3: Upload the image
    console.log('\n3️⃣ Testing image upload...');
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));

    const uploadResponse = await fetch(`${API_URL}/api/upload/image`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('✅ Upload response:', uploadResult);

    if (!uploadResult.success) {
      throw new Error('Upload was not successful');
    }

    // Test 4: Verify the uploaded image URL is accessible
    console.log('\n4️⃣ Testing uploaded image URL accessibility...');
    const imageUrl = uploadResult.url;
    console.log('📸 Testing URL:', imageUrl);

    const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
    if (imageResponse.ok) {
      console.log('✅ Uploaded image is accessible at:', imageUrl);
      console.log('📏 Image size:', imageResponse.headers.get('content-length'), 'bytes');
      console.log('🎨 Content type:', imageResponse.headers.get('content-type'));
    } else {
      console.log('❌ Uploaded image is not accessible:', imageResponse.status);
    }

    // Test 5: Test product creation with image
    console.log('\n5️⃣ Testing product creation with uploaded image...');
    const productData = {
      name: 'Test Product with Image',
      slug: 'test-product-with-image-' + Date.now(),
      description: 'This is a test product to verify image handling',
      price: 99.99,
      category: 'test-category',
      subcategory: 'test-subcategory',
      images: [imageUrl],
      image: imageUrl,
      brand: 'Test Brand',
      stock: 10,
      is_active: true
    };

    const productResponse = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (productResponse.ok) {
      const createdProduct = await productResponse.json();
      console.log('✅ Product created successfully with image');
      console.log('🆔 Product ID:', createdProduct.data?.id);
      console.log('📸 Product image:', createdProduct.data?.image);
    } else {
      const errorData = await productResponse.json();
      console.log('❌ Product creation failed:', errorData);
    }

    // Test 6: Test product retrieval to verify image URL
    console.log('\n6️⃣ Testing product retrieval...');
    if (uploadResult.success && productData.slug) {
      const getProductResponse = await fetch(`${API_URL}/api/products/slug/${productData.slug}`);
      
      if (getProductResponse.ok) {
        const retrievedProduct = await getProductResponse.json();
        console.log('✅ Product retrieved successfully');
        console.log('📸 Retrieved image URL:', retrievedProduct.image);
        console.log('🖼️ Retrieved images array:', retrievedProduct.images);
        
        // Verify image URLs match
        if (retrievedProduct.image === imageUrl) {
          console.log('✅ Image URL is consistent between creation and retrieval');
        } else {
          console.log('❌ Image URL mismatch');
          console.log('Expected:', imageUrl);
          console.log('Got:', retrievedProduct.image);
        }
      } else {
        console.log('❌ Failed to retrieve product');
      }
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test files...');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('✅ Test image file deleted');
    }

    console.log('\n🎉 Image upload test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Cleanup on error
    const testImagePath = path.join(__dirname, 'test-image.png');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

// Run the test
if (require.main === module) {
  testImageUpload();
}

module.exports = { testImageUpload };
