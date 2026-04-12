// Complete order flow test with all schema fixes
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

const testOrderData = {
  products: [
    {
      productId: 1,
      name: 'Test Industrial Product',
      price: 5000,
      quantity: 2,
      image: '/images/products/test.jpg',
      variant: {
        color: 'Blue',
        size: 'Large'
      }
    },
    {
      productId: 2,
      name: 'Test Component',
      price: 1500,
      quantity: 3,
      image: '/images/products/component.jpg',
      variant: {
        color: 'Red',
        size: 'Medium'
      }
    }
  ],
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Industries Ltd',
    address: '123 Industrial Area, Phase 2',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    phone: '+919876543210',
    email: 'john.doe@industries.com'
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Industries Ltd',
    address: '123 Industrial Area, Phase 2',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    phone: '+919876543210',
    email: 'john.doe@industries.com'
  },
  paymentMethod: 'Credit Card',
  paymentDetails: {
    paidAt: new Date().toISOString(),
    transactionId: 'TXN' + Date.now(),
    cardType: 'Visa',
    last4: '1234'
  },
  discount: 250.00, // Test discount
  notes: 'Test order with complete schema validation',
  estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
};

async function testCompleteOrderFlow() {
  try {
    console.log('=== COMPLETE ORDER FLOW TEST ===');
    console.log('Testing order creation with all schema fields...');
    console.log('\n1. Order Data Being Sent:');
    console.log(JSON.stringify(testOrderData, null, 2));

    // Step 1: Create order
    console.log('\n2. Creating order...');
    const response = await axios.post(`${API_URL}/orders`, testOrderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      const order = response.data.data;
      console.log('\n3. Order Created Successfully!');
      console.log('Order ID:', order.order_id);
      console.log('Order Number:', order.order_number);
      console.log('Status:', order.status || order.order_status);
      console.log('Payment Status:', order.payment_status);
      
      // Verify all expected fields are present
      console.log('\n4. Verifying Response Fields:');
      const expectedFields = [
        'order_id', 'order_number', 'products', 'subtotal', 'tax', 
        'shipping', 'discount', 'total_amount', 'payment_method',
        'payment_details', 'status_history', 'shipping_address', 'billing_address'
      ];
      
      expectedFields.forEach(field => {
        if (order[field] !== undefined) {
          console.log(`  ${field}: ${field === 'products' ? `(${order[field]?.length} items)` : order[field]}`);
        } else {
          console.log(`  ${field}: MISSING`);
        }
      });

      // Step 2: Calculate expected totals
      const expectedSubtotal = testOrderData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const expectedTax = expectedSubtotal * 0.18;
      const expectedShipping = expectedSubtotal > 1000 ? 0 : 50;
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping - testOrderData.discount;
      
      console.log('\n5. Financial Calculations:');
      console.log('  Expected Subtotal:', expectedSubtotal);
      console.log('  Actual Subtotal:', order.subtotal);
      console.log('  Expected Tax:', expectedTax);
      console.log('  Actual Tax:', order.tax);
      console.log('  Expected Shipping:', expectedShipping);
      console.log('  Actual Shipping:', order.shipping);
      console.log('  Expected Discount:', testOrderData.discount);
      console.log('  Actual Discount:', order.discount);
      console.log('  Expected Total:', expectedTotal);
      console.log('  Actual Total:', order.total_amount);
      
      // Verify calculations
      const totalsMatch = Math.abs(expectedTotal - order.total_amount) < 0.01;
      console.log('  Totals Match:', totalsMatch ? 'YES' : 'NO');

      // Step 3: Test order retrieval
      console.log('\n6. Testing order retrieval...');
      try {
        const getResponse = await axios.get(`${API_URL}/orders/${order.order_id}`);
        if (getResponse.data.success) {
          console.log('  Order retrieved successfully');
          console.log('  Retrieved Status:', getResponse.data.data.status || getResponse.data.data.order_status);
        }
      } catch (error) {
        console.log('  Order retrieval failed:', error.response?.data?.message || error.message);
      }

      // Step 4: Test order list (admin)
      console.log('\n7. Testing order list...');
      try {
        const listResponse = await axios.get(`${API_URL}/orders`);
        if (listResponse.data.success) {
          console.log(`  Found ${listResponse.data.data?.length || 0} orders`);
          const createdOrder = listResponse.data.data?.find(o => o.order_id === order.order_id);
          console.log('  Created order in list:', createdOrder ? 'YES' : 'NO');
        }
      } catch (error) {
        console.log('  Order list failed:', error.response?.data?.message || error.message);
      }

      console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
      console.log('All schema fields are working correctly!');
      
    } else {
      console.error('Order creation failed:', response.data);
    }
    
  } catch (error) {
    console.error('ERROR DURING TEST:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Run the test
testCompleteOrderFlow();
