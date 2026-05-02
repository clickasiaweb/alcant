// Simple test to check subcategory structure
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
}

function getSubcategoryName(subcategoryId, product) {
    const name = product.name || '';
    if (name.includes('iPhone')) return 'iPhone Cases';
    if (name.includes('Pixel')) return 'Pixel Cases';
    if (name.includes('Samsung')) return 'Samsung Cases';
    if (name.includes('Watch')) return 'Watch Accessories';
    if (name.includes('AirPod')) return 'AirPod Cases';
    if (name.includes('Wallet')) return 'Wallets';
    if (name.includes('Pet')) return 'Pet Accessories';
    if (name.includes('Screen')) return 'Screen Protectors';
    
    // If subcategoryId is a readable string, use it
    if (subcategoryId && !subcategoryId.match(/^[a-f0-9-]{36}$/i)) {
      return subcategoryId;
    }
    
    return subcategoryId; // Fallback to ID
}

async function testSubcategoryStructure() {
    console.log('🧪 Testing Subcategory Structure...\n');
    
    try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
            params: { limit: 50 }
        });
        
        const products = response.data.products || [];
        console.log(`Found ${products.length} total products\n`);
        
        // Build category hierarchy
        const hierarchy = {};
        
        products.forEach(product => {
            const categoryId = product.category;
            const subcategoryId = product.subcategory;
            const subSubcategoryId = product.subSubcategory;
            
            if (!categoryId) return;
            
            // Initialize main category
            if (!hierarchy[categoryId]) {
                hierarchy[categoryId] = {
                    id: categoryId,
                    name: 'Phone Cases', // Simplified for test
                    subcategories: {}
                };
            }
            
            // Initialize subcategory
            if (subcategoryId && !hierarchy[categoryId].subcategories[subcategoryId]) {
                hierarchy[categoryId].subcategories[subcategoryId] = {
                    id: subcategoryId,
                    name: getSubcategoryName(subcategoryId, product),
                    subSubcategories: {}
                };
            }
        });
        
        // Generate collection mappings
        const mapping = {};
        
        Object.entries(hierarchy).forEach(([categoryId, category]) => {
            // Main category collection
            const mainSlug = slugify(category.name);
            mapping[mainSlug] = {
                title: `${category.name} Collection`,
                categoryId: categoryId
            };
            
            // Subcategory collections
            Object.entries(category.subcategories).forEach(([subcategoryId, subcategory]) => {
                const categorySlug = slugify(category.name);
                const subSlug = slugify(subcategory.name);
                const uniqueSubSlug = `${categorySlug}-${subSlug}`;
                
                mapping[uniqueSubSlug] = {
                    title: `${subcategory.name} Collection`,
                    categoryId: categoryId,
                    subCategoryId: subcategoryId
                };
                
                // Also add simple slug
                if (!mapping[subSlug]) {
                    mapping[subSlug] = {
                        title: `${subcategory.name} Collection`,
                        categoryId: categoryId,
                        subCategoryId: subcategoryId
                    };
                }
            });
        });
        
        console.log('📊 Generated Collection Mappings:');
        Object.entries(mapping).forEach(([slug, data]) => {
            console.log(`  ${slug}: ${data.title}`);
            console.log(`    Category ID: ${data.categoryId}`);
            console.log(`    Subcategory ID: ${data.subCategoryId || 'none'}`);
            
            // Count products for this mapping
            const matchingProducts = products.filter(p => {
                if (data.subCategoryId) {
                    return p.category === data.categoryId && p.subcategory === data.subCategoryId;
                } else {
                    return p.category === data.categoryId;
                }
            });
            
            console.log(`    Products: ${matchingProducts.length}`);
            console.log('');
        });
        
        // Test specific cases
        console.log('🎯 Test Cases:');
        
        // Test iPhone Cases
        const iphoneCasesMapping = mapping['iphone-cases'] || mapping['phone-cases-iphone-cases'];
        if (iphoneCasesMapping) {
            const iphoneProducts = products.filter(p => 
                p.category === iphoneCasesMapping.categoryId && 
                p.subcategory === iphoneCasesMapping.subCategoryId
            );
            console.log(`✅ iPhone Cases: ${iphoneProducts.length} products`);
        }
        
        // Test Pixel Cases
        const pixelCasesMapping = mapping['pixel-cases'] || mapping['phone-cases-pixel-cases'];
        if (pixelCasesMapping) {
            const pixelProducts = products.filter(p => 
                p.category === pixelCasesMapping.categoryId && 
                p.subcategory === pixelCasesMapping.subCategoryId
            );
            console.log(`✅ Pixel Cases: ${pixelProducts.length} products`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testSubcategoryStructure();
