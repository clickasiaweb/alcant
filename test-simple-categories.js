// Simple test to see category structure
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testCategories() {
    console.log('🧪 Testing Category Structure...\n');
    
    try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
            params: { limit: 50 }
        });
        
        const products = response.data.products || [];
        console.log(`Found ${products.length} total products\n`);
        
        // Find iPhone 17 Pro products
        const iphone17Products = products.filter(product => {
            const name = (product.name || '').toLowerCase();
            return name.includes('17 pro');
        });
        
        console.log(`📱 iPhone 17 Pro Products (${iphone17Products.length}):`);
        iphone17Products.forEach((product, i) => {
            console.log(`${i + 1}. ${product.name}`);
            console.log(`   Category: ${product.category}`);
            console.log(`   Subcategory: ${product.subcategory || 'none'}`);
            console.log(`   Sub-Subcategory: ${product.subSubcategory || 'none'}`);
            console.log('');
        });
        
        // Show all subcategories in Phone Cases category
        const phoneCaseCategory = 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be';
        const phoneCaseProducts = products.filter(p => p.category === phoneCaseCategory);
        
        console.log(`📊 Phone Cases Category (${phoneCaseProducts.length} products):`);
        
        const subcategories = {};
        phoneCaseProducts.forEach(product => {
            const sub = product.subcategory || 'none';
            if (!subcategories[sub]) {
                subcategories[sub] = [];
            }
            subcategories[sub].push(product.name);
        });
        
        Object.entries(subcategories).forEach(([subId, names]) => {
            console.log(`\n  📁 ${subId} (${names.length} products):`);
            names.slice(0, 3).forEach(name => {
                console.log(`    - ${name}`);
            });
            if (names.length > 3) {
                console.log(`    ... and ${names.length - 3} more`);
            }
        });
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testCategories();
