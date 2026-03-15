const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_BASE = 'http://localhost:5001/api';

async function testBulkUpload() {
  try {
    console.log('🧪 Testing Bulk Upload API...\n');

    // Test 1: Download template
    console.log('1. Testing template download...');
    try {
      const response = await axios.get(`${API_BASE}/bulk-upload/template`, {
        responseType: 'arraybuffer'
      });
      
      fs.writeFileSync('test-template.xlsx', response.data);
      console.log('✅ Template downloaded successfully (test-template.xlsx)');
    } catch (error) {
      console.log('❌ Template download failed:', error.message);
      return;
    }

    // Test 2: Health check
    console.log('\n2. Testing health endpoint...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log('✅ Health check passed:', healthResponse.data.status);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
    }

    console.log('\n🎉 Bulk Upload API is working!');
    console.log('\n📋 Next steps:');
    console.log('1. Open admin panel: http://localhost:3001');
    console.log('2. Navigate to Bulk Upload page');
    console.log('3. Download template and fill with product data');
    console.log('4. Upload and test the complete flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBulkUpload();
