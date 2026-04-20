const http = require('http');

// Simple test to check if upload endpoint works
function testUploadEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('✅ Server is running');
      console.log('Response:', data);
      
      // Now test upload endpoint
      testUpload();
    });
  });

  req.on('error', (e) => {
    console.log('❌ Server not running:', e.message);
  });

  req.end();
}

function testUpload() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/upload/image',
    method: 'POST'
  };

  const req = http.request(options, (res) => {
    console.log(`📸 Upload endpoint status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Upload endpoint is working');
    } else {
      console.log('❌ Upload endpoint returned:', res.statusCode);
    }
  });

  req.on('error', (e) => {
    console.log('❌ Upload endpoint error:', e.message);
  });

  req.end();
}

console.log('🧪 Quick Verification Test...');
testUploadEndpoint();
