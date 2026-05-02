// Test script to verify categoryId API calls work
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testCategoryId() {
    console.log('🧪 Testing Category ID API calls...\n');
    
    try {
        // Test with the actual category ID we found
        const categoryId = 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be';
        
        console.log(`🔍 Testing with categoryId: ${categoryId}`);
        
        // Test 1: Get products with categoryId
        console.log('\n📦 Testing getProducts with categoryId...');
        const response = await axios.get(`${API_BASE_URL}/products`, {
            params: { 
                categoryId: categoryId,
                limit: 10
            }
        });
        
        console.log('✅ Success!');
        console.log('Response type:', typeof response.data);
        console.log('Response keys:', Object.keys(response.data));
        
        let products = [];
        if (Array.isArray(response.data)) {
            products = response.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
            products = response.data.products;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
            products = response.data.data;
        }
        
        console.log(`Found ${products.length} products`);
        
        if (products.length > 0) {
            console.log('\n📋 Sample products:');
            products.slice(0, 3).forEach((product, i) => {
                console.log(`${i + 1}. ${product.name}`);
                console.log(`   Category: ${product.category}`);
                console.log(`   Subcategory: ${product.subcategory || 'none'}`);
                console.log(`   Price: ₹${product.price || 'N/A'}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testCategoryId();
