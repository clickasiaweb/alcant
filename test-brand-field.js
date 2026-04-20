const http = require('http');

// Test if brand field exists by trying to create a product with brand
function testBrandField() {
  const testData = {
    name: 'Test Product for Brand Check',
    slug: 'test-brand-check-' + Date.now(),
    description: 'Test product to check brand field',
    price: 99.99,
    category: 'test-category',
    subcategory: 'test-subcategory',
    brand: 'Test Brand',
    images: ['test.jpg'],
    is_active: true
  };

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      try {
        const response = JSON.parse(data);
        console.log('Response:', response);
        
        if (res.statusCode === 201) {
          console.log('SUCCESS: Brand field exists and works!');
          console.log('Created product ID:', response.data?.id);
        } else {
          console.log('ERROR:', response.error);
          if (response.error && response.error.includes('brand')) {
            console.log('Brand field issue detected');
          }
        }
      } catch (e) {
        console.log('Invalid JSON response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
  });

  req.write(JSON.stringify(testData));
  req.end();
}

// Test getting products to see if brand field is returned
function testGetProducts() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/products?limit=1',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('\n=== GET PRODUCTS TEST ===');
      console.log(`Status: ${res.statusCode}`);
      try {
        const products = JSON.parse(data);
        if (products.length > 0) {
          console.log('Sample product fields:', Object.keys(products[0]));
          if (products[0].brand !== undefined) {
            console.log('Brand field found in GET response:', products[0].brand);
          } else {
            console.log('Brand field NOT found in GET response');
          }
        }
      } catch (e) {
        console.log('Invalid JSON response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
  });

  req.end();
}

console.log('Testing brand field in current schema...');
testBrandField();
setTimeout(testGetProducts, 2000);
