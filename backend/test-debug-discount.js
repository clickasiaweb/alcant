// Simple test to see debug logs from backend
const axios = require('axios');

const testOrder = {
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
  discount: 75.50
};

console.log('Sending test order with discount:', testOrder.discount);

axios.post('http://localhost:5001/api/orders', testOrder)
  .then(response => {
    console.log('Response received');
    console.log('Discount in response:', response.data.data.discount);
    console.log('Total in response:', response.data.data.total_amount);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
