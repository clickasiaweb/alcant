const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Helper function to make HTTP requests
function makeRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonData = res.headers['content-type']?.includes('application/json') 
            ? JSON.parse(body) 
            : body;
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Helper function to create multipart form data
function createFormData(filePath) {
  const boundary = '----formdata-test-' + Math.random().toString(16);
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  
  let formData = `--${boundary}\r\n`;
  formData += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
  formData += `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`;
  
  const body = Buffer.concat([
    Buffer.from(formData, 'utf8'),
    fileBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8')
  ]);
  
  return {
    body,
    contentType: `multipart/form-data; boundary=${boundary}`
  };
}

async function testBulkUpload() {
  try {
    console.log('🧪 Testing bulk upload endpoints...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest('http://localhost:5001/api/health');
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 2: Template download
    console.log('2. Testing template download...');
    const templateResponse = await makeRequest('http://localhost:5001/api/products/bulk-upload/template');
    console.log('✅ Template download status:', templateResponse.status);
    console.log('✅ Template size:', templateResponse.data.length, 'bytes');
    
    // Save template to file for testing
    fs.writeFileSync('test-template-new.xlsx', templateResponse.data);
    console.log('✅ Template saved as test-template-new.xlsx');
    console.log('');

    // Test 3: Parse the downloaded template
    console.log('3. Testing file parsing...');
    const formData = createFormData('test-template-new.xlsx');
    const parseResponse = await makeRequest('http://localhost:5001/api/products/bulk-upload/parse', {
      method: 'POST',
      headers: {
        'Content-Type': formData.contentType,
        'Content-Length': formData.body.length
      }
    }, formData.body);
    
    console.log('✅ Parse response status:', parseResponse.status);
    console.log('✅ Parse data:', {
      totalRows: parseResponse.data.data?.totalRows,
      validProducts: parseResponse.data.data?.validProducts,
      invalidRows: parseResponse.data.data?.invalidRows,
      errorsCount: parseResponse.data.data?.errors?.length
    });
    console.log('');

    // Test 4: Test import with sample data (if parsing succeeded)
    if (parseResponse.data.data?.validProducts > 0) {
      console.log('4. Testing product import...');
      const importData = JSON.stringify({
        products: parseResponse.data.data.products
      });
      
      const importResponse = await makeRequest('http://localhost:5001/api/products/bulk-upload/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': importData.length
        }
      }, importData);
      
      console.log('✅ Import response status:', importResponse.status);
      console.log('✅ Import results:', {
        message: importResponse.data.message,
        successCount: importResponse.data.results?.success?.length,
        errorCount: importResponse.data.results?.errors?.length
      });
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBulkUpload();
