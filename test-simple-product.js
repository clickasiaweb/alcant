// Test simple product creation
const testSimpleProduct = async () => {
  try {
    console.log('🧪 Testing simple product creation...');
    
    const response = await fetch('http://localhost:5001/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Simple Test Product',
        category: 'Phone Cases',
        subcategory: 'iPhone Cases',
        price: 99.99,
        description: 'Simple test product without sub-subcategories'
      })
    });

    const data = await response.json();
    console.log('✅ Response status:', response.status);
    console.log('✅ Response data:', data);
    
    if (data.data) {
      console.log('🎉 Product created successfully!');
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testSimpleProduct();
