// Basic connection test
const axios = require('axios');

console.log('Testing basic backend connection...');

axios.get('http://localhost:5001/api/health')
  .then(response => {
    console.log('✅ Backend server is running');
    console.log('Database connected:', response.data.database.connected);
    
    // Test order creation (will fail due to schema but shows connection works)
    return axios.post('http://localhost:5001/api/orders', {
      products: [{ productId: 1, name: 'Test', price: 100, quantity: 1 }],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: 'Test',
        city: 'Test',
        state: 'Test',
        postalCode: '12345',
        country: 'Test',
        phone: '123',
        email: 'test@test.com'
      },
      paymentMethod: 'Test',
      discount: 50
    });
  })
  .then(response => {
    console.log('✅ Order creation successful!');
    console.log('Discount stored:', response.data.data.discount);
  })
  .catch(error => {
    if (error.response?.data?.error?.includes('column')) {
      console.log('❌ Database schema issue detected');
      console.log('Error:', error.response.data.error);
      console.log('\n🔧 REQUIRED ACTION:');
      console.log('Run backend/fix-complete-schema.sql in Supabase SQL Editor');
    } else {
      console.log('❌ Other error:', error.response?.data?.message || error.message);
    }
  });
