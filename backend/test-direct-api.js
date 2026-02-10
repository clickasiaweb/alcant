const axios = require('axios');

async function testDirectAPI() {
  try {
    const testSlug = 'alcanside-iphone-15-pro-case';
    const apiUrl = `http://localhost:5001/api/products/slug/${testSlug}`;
    
    console.log(`Testing direct API call: ${apiUrl}`);
    
    const response = await axios.get(apiUrl);
    
    console.log('✅ API Response:', response.data);
    console.log('✅ Status:', response.status);
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

testDirectAPI();
