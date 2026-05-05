// Debug script to test category navigation
console.log('🧪 Testing Category Navigation Debug\n');

// Test the exact URL structure that should work
const testUrls = [
  'http://localhost:3000/category/phone-cases/iphone-cases/17-pro',
  'http://localhost:5001/api/products?sub_subcategory_id=f9e3a722-fc55-4492-b34b-705d57f16992'
];

console.log('📋 Expected URL structure:');
console.log('Frontend URL: /category/phone-cases/iphone-cases/17-pro');
console.log('Backend API: /api/products?sub_subcategory_id=f9e3a722-fc55-4492-b34b-705d57f16992');

// Test API call directly
fetch('http://localhost:5001/api/products?sub_subcategory_id=f9e3a722-fc55-4492-b34b-705d57f16992')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Response:', {
      productsFound: data.products.length,
      total: data.pagination.total,
      firstProduct: data.products[0]?.name
    });
  })
  .catch(error => {
    console.error('❌ API Error:', error);
  });

// Check category hierarchy
fetch('http://localhost:5001/api/categories/hierarchy')
  .then(response => response.json())
  .then(data => {
    const phoneCases = data.data.find(cat => cat.slug === 'phone-cases');
    const iphoneCases = phoneCases?.subcategories.find(sub => sub.slug === 'iphone-cases');
    const targetSubSub = iphoneCases?.sub_subcategories.find(ss => ss.slug === '17-pro');
    
    console.log('📁 Category Structure Check:');
    console.log('Phone Cases:', phoneCases?.name);
    console.log('iPhone Cases:', iphoneCases?.name);
    console.log('Target Sub-Subcategory:', {
      name: targetSubSub?.name,
      slug: targetSubSub?.slug,
      id: targetSubSub?.id
    });
  })
  .catch(error => {
    console.error('❌ Category Error:', error);
  });
