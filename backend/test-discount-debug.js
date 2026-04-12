// Debug test to check discount handling
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
      variant: { color: 'Red', size: 'M' }
    }
  ],
  shippingAddress: {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
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
    address: '123 Test St',
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
  discount: 150.00, // Test with specific discount
  notes: 'Debug test for discount handling'
};

async function testDiscountDebug() {
  try {
    console.log('=== DISCOUNT DEBUG TEST ===');
    console.log('Sending order with discount:', testOrderData.discount);
    
    const response = await axios.post(`${API_URL}/orders`, testOrderData);
    
    if (response.data.success) {
      const order = response.data.data;
      console.log('\nOrder created successfully!');
      console.log('Order ID:', order.order_id);
      console.log('Subtotal:', order.subtotal);
      console.log('Tax:', order.tax);
      console.log('Shipping:', order.shipping);
      console.log('Discount (sent):', testOrderData.discount);
      console.log('Discount (stored):', order.discount);
      console.log('Total Amount:', order.total_amount);
      
      // Calculate expected values
      const expectedSubtotal = 1000 * 2; // 2000
      const expectedTax = expectedSubtotal * 0.18; // 360
      const expectedShipping = expectedSubtotal > 1000 ? 0 : 50; // 0
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping - testOrderData.discount; // 2000 + 360 + 0 - 150 = 2210
      
      console.log('\nExpected Calculations:');
      console.log('Expected Subtotal:', expectedSubtotal);
      console.log('Expected Tax:', expectedTax);
      console.log('Expected Shipping:', expectedShipping);
      console.log('Expected Total:', expectedTotal);
      
      console.log('\nActual vs Expected:');
      console.log('Subtotal Match:', order.subtotal === expectedSubtotal ? 'YES' : 'NO');
      console.log('Tax Match:', order.tax === expectedTax ? 'YES' : 'NO');
      console.log('Shipping Match:', order.shipping === expectedShipping ? 'YES' : 'NO');
      console.log('Discount Match:', order.discount === testOrderData.discount ? 'YES' : 'NO');
      console.log('Total Match:', order.total_amount === expectedTotal ? 'YES' : 'NO');
      
      if (order.discount !== testOrderData.discount) {
        console.log('\n!!! DISCOUNT ISSUE DETECTED !!!');
        console.log('Discount not properly stored in database');
      }
      
    } else {
      console.error('Order creation failed:', response.data);
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testDiscountDebug();
