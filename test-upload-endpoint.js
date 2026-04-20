const http = require('http');

// Test the upload endpoint
function testUploadEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/upload',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

// Test the main API endpoint
function testMainEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\nMain API Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Main API Response:', JSON.parse(data));
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with main API request: ${e.message}`);
  });

  req.end();
}

console.log('🧪 Testing Upload Endpoint...');
testUploadEndpoint();

setTimeout(() => {
  console.log('\n🧪 Testing Main API Endpoint...');
  testMainEndpoint();
}, 1000);
