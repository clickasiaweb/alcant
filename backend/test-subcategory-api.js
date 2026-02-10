require('dotenv').config();
const express = require('express');
const { createAdminSubCategory } = require('./controllers/adminController');

// Create a minimal Express app to test the controller
const app = express();
app.use(express.json());

// Mock request/response
const mockReq = {
  body: {
    name: 'Test Subcategory API',
    slug: 'test-subcategory-api',
    categoryId: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be', // Phone Cases category ID
    description: 'Test description via API',
    isActive: true
  }
};

const mockRes = {
  status: function(code) {
    console.log(`Status: ${code}`);
    return this;
  },
  json: function(data) {
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  }
};

async function testSubcategoryAPI() {
  try {
    console.log('Testing createSubCategory controller...');
    console.log('Request body:', mockReq.body);
    
    const result = await createAdminSubCategory(mockReq, mockRes);
    console.log('✅ API test completed successfully');
    return result;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return null;
  }
}

testSubcategoryAPI();
