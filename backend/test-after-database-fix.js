// Test script to verify fixes work after database schema is updated
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAfterDatabaseFix() {
  try {
    console.log('=== POST-DATABASE FIX TEST ===');
    console.log('This test shows expected behavior after database schema is fixed\n');

    const testOrder = {
      products: [
        {
          productId: 1,
          name: 'Industrial Sensor',
          price: 2500,
          quantity: 3,
          image: '/images/products/sensor.jpg',
          variant: { color: 'Black', size: 'Standard' }
        },
        {
          productId: 2,
          name: 'Control Module',
          price: 1800,
          quantity: 2,
          image: '/images/products/module.jpg',
          variant: { color: 'Blue', size: 'Large' }
        }
      ],
      shippingAddress: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        company: 'Tech Industries',
        address: '456 Technology Park, Building A',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        phone: '+919876543210',
        email: 'sarah.johnson@techindustries.com'
      },
      billingAddress: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        company: 'Tech Industries',
        address: '456 Technology Park, Building A',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        phone: '+919876543210',
        email: 'sarah.johnson@techindustries.com'
      },
      paymentMethod: 'Credit Card',
      paymentDetails: {
        paidAt: new Date().toISOString(),
        transactionId: 'TXN' + Date.now(),
        cardType: 'Mastercard',
        last4: '5678'
      },
      discount: 500.00, // Test discount
      notes: 'Test order after database schema fix',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('1. Creating order with discount...');
    console.log('   Discount Amount:', testOrder.discount);
    
    const response = await axios.post(`${API_URL}/orders`, testOrder);
    
    if (response.data.success) {
      const order = response.data.data;
      console.log('\n2. Order Created Successfully!');
      console.log('   Order ID:', order.order_id);
      console.log('   Status:', order.status || order.order_status);
      console.log('   Payment Status:', order.payment_status);
      
      console.log('\n3. Financial Breakdown:');
      console.log('   Subtotal:', order.subtotal);
      console.log('   Tax (18%):', order.tax);
      console.log('   Shipping:', order.shipping);
      console.log('   Discount:', order.discount);
      console.log('   Total Amount:', order.total_amount);
      
      // Verify calculations
      const expectedSubtotal = (2500 * 3) + (1800 * 2); // 7500 + 3600 = 11100
      const expectedTax = expectedSubtotal * 0.18; // 1998
      const expectedShipping = expectedSubtotal > 1000 ? 0 : 50; // 0
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping - testOrder.discount; // 11100 + 1998 + 0 - 500 = 12598
      
      console.log('\n4. Expected vs Actual:');
      console.log('   Expected Subtotal:', expectedSubtotal, '| Actual:', order.subtotal, '| Match:', order.subtotal === expectedSubtotal ? 'YES' : 'NO');
      console.log('   Expected Tax:', expectedTax, '| Actual:', order.tax, '| Match:', order.tax === expectedTax ? 'YES' : 'NO');
      console.log('   Expected Shipping:', expectedShipping, '| Actual:', order.shipping, '| Match:', order.shipping === expectedShipping ? 'YES' : 'NO');
      console.log('   Expected Discount:', testOrder.discount, '| Actual:', order.discount, '| Match:', order.discount === testOrder.discount ? 'YES' : 'NO');
      console.log('   Expected Total:', expectedTotal, '| Actual:', order.total_amount, '| Match:', Math.abs(order.total_amount - expectedTotal) < 0.01 ? 'YES' : 'NO');
      
      console.log('\n5. Order Details:');
      console.log('   Products:', order.products?.length || 0, 'items');
      console.log('   Payment Method:', order.payment_method);
      console.log('   Status History:', order.status_history?.length || 0, 'entries');
      console.log('   Estimated Delivery:', order.estimated_delivery || 'Not set');
      
      console.log('\n6. Test Results:');
      const allFieldsPresent = [
        'order_id', 'products', 'subtotal', 'tax', 'shipping', 
        'discount', 'total_amount', 'payment_method', 'status_history'
      ].every(field => order[field] !== undefined);
      
      console.log('   All Required Fields Present:', allFieldsPresent ? 'YES' : 'NO');
      console.log('   Discount Applied Correctly:', order.discount === testOrder.discount ? 'YES' : 'NO');
      console.log('   Financial Calculations Correct:', Math.abs(order.total_amount - expectedTotal) < 0.01 ? 'YES' : 'NO');
      
      if (allFieldsPresent && order.discount === testOrder.discount && Math.abs(order.total_amount - expectedTotal) < 0.01) {
        console.log('\n=== ALL TESTS PASSED! ===');
        console.log('Order placement system is working correctly with discount support.');
      } else {
        console.log('\n=== SOME TESTS FAILED ===');
        console.log('Database schema may need to be updated. See DATABASE_FIX_INSTRUCTIONS.md');
      }
      
    } else {
      console.error('Order creation failed:', response.data);
    }
    
  } catch (error) {
    console.error('Error during test:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.message?.includes('discount')) {
      console.log('\n=== DATABASE SCHEMA ISSUE ===');
      console.log('The discount column (and other columns) are missing from the database.');
      console.log('Please run the SQL commands in DATABASE_FIX_INSTRUCTIONS.md');
    }
  }
}

testAfterDatabaseFix();
