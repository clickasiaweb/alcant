// Check if discount column exists in database
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function checkDatabaseSchema() {
  try {
    console.log('=== DATABASE SCHEMA CHECK ===');
    
    // Try to create an order with discount to see if column exists
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
      discount: 50.00
    };
    
    console.log('Testing order creation with discount...');
    const response = await axios.post(`${API_URL}/orders`, testOrder);
    
    if (response.data.success) {
      const order = response.data.data;
      console.log('Order created successfully');
      console.log('Discount sent:', 50.00);
      console.log('Discount stored:', order.discount);
      
      if (order.discount === 50.00) {
        console.log('SUCCESS: Discount column exists and works correctly');
      } else {
        console.log('ISSUE: Discount column exists but not working properly');
        console.log('Expected: 50.00, Got:', order.discount);
      }
    }
    
  } catch (error) {
    if (error.response?.data?.message?.includes('discount')) {
      console.log('ISSUE: Discount column does not exist in database');
      console.log('Please run the SQL script in Supabase:');
      console.log('');
      console.log('ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0.00;');
      console.log('UPDATE orders SET discount = 0.00 WHERE discount IS NULL;');
      console.log('CREATE INDEX idx_orders_discount ON orders(discount);');
    } else {
      console.log('Other error:', error.response?.data?.message || error.message);
    }
  }
}

checkDatabaseSchema();
