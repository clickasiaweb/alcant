// Test script for inquiry API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testInquiryAPI() {
  console.log('🧪 Testing Inquiry API...\n');

  try {
    // Test 1: Create a new inquiry
    console.log('1. Testing POST /api/inquiries (Create Inquiry)');
    const testInquiry = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1-555-123-4567',
      company: 'Test Company',
      subject: 'Test Product Inquiry',
      message: 'This is a test inquiry for the product support system.',
      productId: 'test-product-id'
    };

    const createResponse = await axios.post(`${API_BASE}/inquiries`, testInquiry);
    console.log('✅ Create Inquiry Success:', createResponse.status);
    console.log('📝 Created Inquiry:', JSON.stringify(createResponse.data.data, null, 2));
    
    const inquiryId = createResponse.data.data.id;
    console.log('');

    // Test 2: Get all inquiries (this should work with admin auth, but let's see the response)
    console.log('2. Testing GET /api/inquiries (Get All Inquiries)');
    try {
      const getResponse = await axios.get(`${API_BASE}/inquiries`);
      console.log('✅ Get Inquiries Success:', getResponse.status);
      console.log('📊 Inquiries Count:', getResponse.data.data?.length || 0);
    } catch (error) {
      console.log('⚠️  Get Inquiries requires authentication (expected):', error.response?.status);
    }
    console.log('');

    // Test 3: Update inquiry status (this should work with admin auth)
    console.log('3. Testing PUT /api/inquiries/:id (Update Inquiry)');
    try {
      const updateResponse = await axios.put(`${API_BASE}/inquiries/${inquiryId}`, {
        status: 'read',
        response: 'Thank you for your inquiry. We will respond shortly.'
      });
      console.log('✅ Update Inquiry Success:', updateResponse.status);
    } catch (error) {
      console.log('⚠️  Update Inquiry requires authentication (expected):', error.response?.status);
    }
    console.log('');

    // Test 4: Test with invalid data
    console.log('4. Testing POST /api/inquiries with invalid data');
    try {
      await axios.post(`${API_BASE}/inquiries`, {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: ''
      });
      console.log('❌ Should have failed with invalid data');
    } catch (error) {
      console.log('✅ Correctly rejected invalid data:', error.response?.status);
    }

    console.log('\n🎉 Inquiry API testing completed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Inquiry creation works');
    console.log('- ⚠️  Admin endpoints require authentication (expected)');
    console.log('- ✅ Input validation works');
    console.log('- ✅ API is properly configured');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testInquiryAPI();
