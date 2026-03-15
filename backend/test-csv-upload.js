const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testCSVUpload() {
  try {
    console.log('🧪 Testing CSV file upload with existing categories...');
    
    // Read the sample CSV file
    const csvContent = fs.readFileSync('../admin-panel/public/sample-template.csv', 'utf8');
    console.log('📄 Sample CSV file loaded');
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', csvContent, {
      filename: 'sample-products.csv',
      contentType: 'text/csv'
    });
    
    console.log('📤 Uploading CSV to http://localhost:5001/api/bulk-upload/parse');
    
    // Test upload
    const response = await axios.post('http://localhost:5001/api/bulk-upload/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      maxBodyLength: 10 * 1024 * 1024, // 10MB
      timeout: 30000
    });
    
    console.log('✅ CSV Upload response:', response.data);
    console.log('📊 Parsed products:', response.data.data?.products?.length || 0);
    console.log('❌ Errors:', response.data.data?.errors?.length || 0);
    
    if (response.data.data?.errors?.length > 0) {
      console.log('🚨 Errors found:');
      response.data.data.errors.forEach(error => {
        console.log(`  Row ${error.row}: ${error.field} - ${error.message}`);
      });
    }
    
  } catch (error) {
    console.error('❌ CSV Upload test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCSVUpload();
