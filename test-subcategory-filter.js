// Test subcategory filtering
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testSubcategoryFilter() {
    console.log('🧪 Testing Subcategory Filtering...\n');
    
    try {
        // Test filters for your admin panel selection
        const categoryId = 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be';
        const subCategoryId = '3207f43f-b904-486e-b2e5-9c6230eb7793'; // iPhone Cases
        
        console.log('📱 Testing iPhone Cases Subcategory');
        console.log(`Category ID: ${categoryId}`);
        console.log(`Subcategory ID: ${subCategoryId}`);
        
        // Test 1: All products in main category (should be 15)
        console.log('\n📦 Test 1: All Phone Cases products');
        const allResponse = await axios.get(`${API_BASE_URL}/products`, {
            params: { categoryId: categoryId, limit: 50 }
        });
        console.log(`Found: ${allResponse.data.products?.length || 0} products`);
        
        // Test 2: Only iPhone Cases subcategory (should be fewer)
        console.log('\n📦 Test 2: iPhone Cases subcategory only');
        const subResponse = await axios.get(`${API_BASE_URL}/products`, {
            params: { 
                categoryId: categoryId, 
                subCategoryId: subCategoryId, 
                limit: 50 
            }
        });
        console.log(`Found: ${subResponse.data.products?.length || 0} products`);
        
        // Show sample products
        if (subResponse.data.products && subResponse.data.products.length > 0) {
            console.log('\n📋 iPhone Cases products:');
            subResponse.data.products.slice(0, 3).forEach((product, i) => {
                console.log(`${i + 1}. ${product.name}`);
                console.log(`   Subcategory: ${product.subcategory || 'none'}`);
                console.log(`   Price: ₹${product.price || 'N/A'}`);
            });
        }
        
        // Test 3: Check if any products have the specific subcategory
        console.log('\n🔍 Checking subcategory distribution:');
        const allProducts = allResponse.data.products || [];
        const subcategoryCount = allProducts.filter(p => p.subcategory === subCategoryId).length;
        console.log(`Products with iPhone Cases subcategory: ${subcategoryCount}`);
        
        // Show all subcategories in this category
        const subcategories = {};
        allProducts.forEach(product => {
            const sub = product.subcategory || 'none';
            subcategories[sub] = (subcategories[sub] || 0) + 1;
        });
        
        console.log('\n📊 Subcategory breakdown:');
        Object.entries(subcategories).forEach(([sub, count]) => {
            console.log(`  ${sub}: ${count} products`);
        });
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testSubcategoryFilter();
