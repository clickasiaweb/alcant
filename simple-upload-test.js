// Simple test for image upload using built-in Node.js modules
const fs = require('fs');
const path = require('path');
const http = require('http');

// Create a simple test image
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

// Create multipart form data boundary
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const formData = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="image"; filename="test.png"',
  'Content-Type: image/png',
  '',
  testImageData.toString('base64'),
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
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    try {
      const result = JSON.parse(data);
      if (res.statusCode === 200 && result.success) {
        console.log('✅ Image upload successful!');
        console.log('URL:', result.url);
      } else {
        console.log('❌ Image upload failed');
        console.log('Error:', result.message || result.error);
      }
    } catch (e) {
      console.log('❌ Failed to parse response');
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(formData);
req.end();

console.log('Testing image upload...');
