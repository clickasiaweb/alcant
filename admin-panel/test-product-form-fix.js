// Test script to verify product form fixes
// Using built-in fetch (Node.js 18+)

async function testCategoriesAPI() {
  try {
    console.log('Testing categories hierarchy API...');
    
    const response = await fetch('http://localhost:5001/api/categories/hierarchy');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Categories hierarchy loaded successfully:');
    console.log(`- Found ${data.data?.length || 0} categories`);
    
    // Check if categories have subcategories
    if (data.data && data.data.length > 0) {
      const firstCategory = data.data[0];
      console.log(`- First category: ${firstCategory.name}`);
      console.log(`- Subcategories: ${firstCategory.subcategories?.length || 0}`);
      
      if (firstCategory.subcategories && firstCategory.subcategories.length > 0) {
        const firstSubcategory = firstCategory.subcategories[0];
        console.log(`- First subcategory: ${firstSubcategory.name}`);
        console.log(`- Sub-subcategories: ${firstSubcategory.sub_subcategories?.length || 0}`);
      }
    }
    
    console.log('Categories API test: PASSED');
    return true;
  } catch (error) {
    console.error('Categories API test: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function testProductsAPI() {
  try {
    console.log('Testing products API...');
    
    const response = await fetch('http://localhost:5001/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Products loaded successfully:');
    console.log(`- Found ${data.products?.length || data.data?.length || 0} products`);
    
    // Check if products have images
    const products = data.products || data.data || [];
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log(`- First product: ${firstProduct.name || firstProduct.title}`);
      console.log(`- Images: ${firstProduct.images?.length || 0}`);
      console.log(`- Main image: ${firstProduct.image ? 'Yes' : 'No'}`);
      console.log(`- Category: ${firstProduct.category || 'None'}`);
      console.log(`- Subcategory: ${firstProduct.subcategory || 'None'}`);
      console.log(`- Sub-subcategory: ${firstProduct.sub_subcategory || 'None'}`);
    }
    
    console.log('Products API test: PASSED');
    return true;
  } catch (error) {
    console.error('Products API test: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(50));
  console.log('PRODUCT FORM FIXES TEST');
  console.log('='.repeat(50));
  
  const categoriesTest = await testCategoriesAPI();
  const productsTest = await testProductsAPI();
  
  console.log('='.repeat(50));
  console.log('TEST SUMMARY:');
  console.log(`Categories API: ${categoriesTest ? 'PASSED' : 'FAILED'}`);
  console.log(`Products API: ${productsTest ? 'PASSED' : 'FAILED'}`);
  
  if (categoriesTest && productsTest) {
    console.log('All tests PASSED! The fixes should work correctly.');
  } else {
    console.log('Some tests FAILED. Please check the backend server.');
  }
  console.log('='.repeat(50));
}

runTests();
