const fs = require('fs');
const path = require('path');
const http = require('http');

// Create a simple test image buffer (1x1 pixel PNG)
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==', 'base64');

function testImageUpload() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="image"; filename="test.png"',
    'Content-Type: image/png',
    '',
    testImageBuffer.toString('base64'),
    `--${boundary}--`
  ].join('\r\n');

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/upload/image',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(formData)
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
      console.log('Upload Response:', data);
      try {
        const parsed = JSON.parse(data);
        if (parsed.success) {
          console.log('✅ Image upload successful!');
          console.log('📸 Image URL:', parsed.url);
        } else {
          console.log('❌ Image upload failed:', parsed.message);
        }
      } catch (e) {
        console.log('❌ Invalid JSON response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with upload request: ${e.message}`);
  });

  req.write(formData);
  req.end();
}

console.log('🧪 Testing Image Upload...');
testImageUpload();
