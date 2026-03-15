require('dotenv').config();
const axios = require('axios');

async function testImport() {
  try {
    console.log('🧪 Testing product import...');
    
    // First upload and parse the file
    const FormData = require('form-data');
    const fs = require('fs');
    
    const csvContent = fs.readFileSync('../admin-panel/public/sample-template.csv', 'utf8');
    
    const formData = new FormData();
    formData.append('file', csvContent, {
      filename: 'sample-products.csv',
      contentType: 'text/csv'
    });
    
    // Parse the file first
    const parseResponse = await axios.post('http://localhost:5001/api/bulk-upload/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      maxBodyLength: 10 * 1024 * 1024,
      timeout: 30000
    });
    
    console.log('✅ Parsed products:', parseResponse.data.data.products.length);
    
    // Now import the products
    const importResponse = await axios.post('http://localhost:5001/api/bulk-upload/import', {
      products: parseResponse.data.data.products
    });
    
    console.log('✅ Import response:', importResponse.data);
    console.log('📊 Successfully imported:', importResponse.data.data?.success?.length || 0);
    console.log('❌ Import errors:', importResponse.data.data?.errors?.length || 0);
    
    // Show detailed errors
    if (importResponse.data.data?.errors && importResponse.data.data.errors.length > 0) {
      console.log('🚨 Detailed import errors:');
      importResponse.data.data.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. Full error object:`, JSON.stringify(error, null, 2));
      });
    }
    
  } catch (error) {
    console.error('❌ Import test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testImport();
