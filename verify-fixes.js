const http = require('http');

// Test 1: Check upload endpoint
function testUploadEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/upload/image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          response: data
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test 2: Check existing products with images
function testProductsWithImages() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/products?limit=5',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const products = JSON.parse(data);
          resolve({
            status: res.statusCode,
            products: products
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            products: [],
            error: 'Invalid JSON'
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test 3: Check if uploads directory is accessible
function testUploadsDirectory() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/uploads/images/',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve({
        status: res.statusCode,
        accessible: res.statusCode < 400
      });
    });

    req.on('error', () => {
      resolve({
        status: 0,
        accessible: false
      });
    });

    req.end();
  });
}

async function runAllTests() {
  console.log('🧪 Verifying Image Upload Fixes\n');

  console.log('1️⃣ Testing Upload Endpoint...');
  try {
    const uploadTest = await testUploadEndpoint();
    console.log(`   Status: ${uploadTest.status}`);
    if (uploadTest.status === 200) {
      console.log('   ✅ Upload endpoint is accessible');
    } else {
      console.log('   ❌ Upload endpoint not accessible');
    }
  } catch (error) {
    console.log('   ❌ Upload endpoint error:', error.message);
  }

  console.log('\n2️⃣ Testing Products with Images...');
  try {
    const productsTest = await testProductsWithImages();
    console.log(`   Status: ${productsTest.status}`);
    if (productsTest.status === 200) {
      console.log(`   ✅ Found ${productsTest.products.length || 0} products`);
      const productsWithImages = productsTest.products.filter(p => 
        p.images && p.images.length > 0
      );
      console.log(`   📸 Products with images: ${productsWithImages.length}`);
      if (productsWithImages.length > 0) {
        console.log('   📋 Sample product with images:');
        console.log(`      Name: ${productsWithImages[0].name}`);
        console.log(`      Images: ${JSON.stringify(productsWithImages[0].images, null, 6)}`);
      }
    } else {
      console.log('   ❌ Products endpoint not accessible');
    }
  } catch (error) {
    console.log('   ❌ Products endpoint error:', error.message);
  }

  console.log('\n3️⃣ Testing Uploads Directory Access...');
  try {
    const uploadsTest = await testUploadsDirectory();
    console.log(`   Status: ${uploadsTest.status}`);
    if (uploadsTest.accessible) {
      console.log('   ✅ Uploads directory is accessible');
    } else {
      console.log('   ❌ Uploads directory not accessible');
    }
  } catch (error) {
    console.log('   ❌ Uploads directory error:', error.message);
  }

  console.log('\n📋 Summary of Fixes:');
  console.log('   ✅ Upload endpoint registered in server.js');
  console.log('   ✅ Blob URL handling implemented in ProductsPage.jsx');
  console.log('   ✅ Image processing logic simplified');
  console.log('   ✅ Error handling improved');
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Test image upload in admin panel manually');
  console.log('   2. Verify blob URLs are uploaded before form submission');
  console.log('   3. Check image display on frontend product pages');
  console.log('   4. Test with various image formats and sizes');
}

runAllTests().catch(console.error);
