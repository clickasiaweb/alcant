// Test order creation with discount field
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

const testOrderData = {
  products: [
    {
      productId: 1,
      name: 'Test Product',
      price: 1000,
      quantity: 2,
      image: '/images/products/test.jpg',
      variant: {
        color: 'Red',
        size: 'Large'
      }
    }
  ],
  shippingAddress: {
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    country: 'Test Country',
    phone: '1234567890',
    email: 'test@example.com'
  },
  billingAddress: {
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    country: 'Test Country',
    phone: '1234567890',
    email: 'test@example.com'
  },
  paymentMethod: 'Credit Card',
  paymentDetails: {
    paidAt: new Date().toISOString(),
    transactionId: 'TXN' + Date.now()
  },
  discount: 100.00, // Test with discount
  notes: 'Test order with discount'
};

async function testOrderCreation() {
  try {
    console.log('Testing order creation with discount...');
    console.log('Order data:', JSON.stringify(testOrderData, null, 2));

    const response = await axios.post(`${API_URL}/orders`, testOrderData);
    
    console.log('Order created successfully!');
    console.log('Response:', response.data);
    
    if (response.data.success && response.data.data) {
      console.log('Order ID:', response.data.data.id);
      console.log('Order Number:', response.data.data.order_number);
      console.log('Discount Applied:', response.data.data.discount);
      console.log('Total Amount:', response.data.data.total_amount);
    }
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
  }
}

// Run the test
testOrderCreation();
