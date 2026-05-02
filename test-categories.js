// Test script to check category-product connection
const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function testCategories() {
    console.log('🔍 Testing Category-Product Connection...');
    console.log(`🌐 API Base URL: ${API_BASE_URL}\n`);
    
    try {
        // 0. Test basic connection
        console.log('🔌 Testing API connection...');
        try {
            const pingResponse = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
            console.log('✅ API is reachable');
        } catch (pingError) {
            console.log('❌ API not reachable - Backend server might not be running');
            console.log('💡 Solution: Start your backend server first');
            console.log('   - Navigate to backend folder');
            console.log('   - Run: npm start or npm run dev');
            return;
        }
        
        // 1. Get all available categories (skip if error)
        console.log('\n📂 Fetching all categories...');
        try {
            const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
            console.log('Categories:', JSON.stringify(categoriesResponse.data, null, 2));
        } catch (catError) {
            console.log('❌ Categories endpoint failed, will analyze products instead');
        }
        
        // 2. Get all products to see their category structure
        console.log('\n📦 Fetching all products...');
        const productsResponse = await axios.get(`${API_BASE_URL}/products`);
        
        // Handle different response formats
        let products = [];
        if (Array.isArray(productsResponse.data)) {
            products = productsResponse.data;
        } else if (productsResponse.data?.products && Array.isArray(productsResponse.data.products)) {
            products = productsResponse.data.products;
        } else {
            console.log('❌ Unexpected products response format:', typeof productsResponse.data);
            return;
        }
        
        console.log(`Found ${products.length} products`);
        
        // 3. Analyze product category structure
        const categoryStructure = {};
        products.forEach(product => {
            const key = `${product.category || 'no-category'} > ${product.subcategory || 'no-subcategory'} > ${product.subSubcategory || 'no-sub-subcategory'}`;
            if (!categoryStructure[key]) {
                categoryStructure[key] = 0;
            }
            categoryStructure[key]++;
        });
        
        console.log('\n📊 Product Category Structure:');
        Object.entries(categoryStructure).forEach(([key, count]) => {
            console.log(`  ${key}: ${count} products`);
        });
        
        // 4. Test specific category fetching
        console.log('\n🧪 Testing specific category API calls...');
        
        const testCategories = ['phone-cases', 'phone cases', 'Phone Cases', 'accessories'];
        
        for (const cat of testCategories) {
            try {
                console.log(`\nTesting category: "${cat}"`);
                const response = await axios.get(`${API_BASE_URL}/products`, {
                    params: { category: cat, limit: 5 }
                });
                console.log(`✅ Success: Found ${response.data.length} products`);
                if (response.data.length > 0) {
                    console.log('Sample product:', response.data[0].name);
                }
            } catch (error) {
                console.log(`❌ Failed: ${error.message}`);
            }
        }
        
        // 5. Check collection content from admin
        console.log('\n🎯 Testing collection content...');
        try {
            const collectionsResponse = await axios.get(`${API_BASE_URL}/content/home`);
            console.log('Collections data:', JSON.stringify(collectionsResponse.data, null, 2));
        } catch (error) {
            console.log('Collections endpoint not available or failed:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testCategories();
