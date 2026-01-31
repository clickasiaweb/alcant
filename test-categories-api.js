const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testCategoriesAPI() {
  try {
    console.log('Testing Categories API...\n');
    
    // Test public categories endpoint
    console.log('1. Testing GET /api/categories');
    try {
      const response = await makeRequest('/api/categories');
      console.log('✅ Status:', response.status);
      console.log('✅ Data:', response.data);
      console.log('Categories count:', response.data.categories?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    console.log('\n2. Testing GET /api/admin/categories');
    try {
      const response = await makeRequest('/api/admin/categories');
      console.log('✅ Status:', response.status);
      console.log('✅ Data:', response.data);
      console.log('Admin categories count:', response.data.categories?.length || 0);
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    console.log('\n3. Testing health endpoint');
    try {
      const response = await makeRequest('/api/health');
      console.log('✅ Health check status:', response.status);
      console.log('✅ Health check data:', response.data);
    } catch (error) {
      console.log('❌ Health check error:', error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCategoriesAPI();
