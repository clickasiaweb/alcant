// Test product update API
const testProductUpdate = async () => {
  try {
    console.log('🧪 Testing product update API...');
    
    const response = await fetch('http://localhost:5001/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Update Product',
        category: 'Phone Cases',
        subcategory: 'iPhone Cases',
        sub_subcategory: '15 Pro Case',
        sub_sub_subcategory: 'Silicon Cases',
        price: 149.99,
        description: 'Test product update functionality'
      })
    });

    const data = await response.json();
    console.log('✅ Response:', data);
    
    if (data.data) {
      console.log('🎉 Product created successfully!');
      console.log('📦 Product details:', {
        id: data.data.id,
        name: data.data.name,
        sub_subcategory: data.data.sub_subcategory,
        sub_sub_subcategory: data.data.sub_sub_subcategory
      });
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testProductUpdate();
