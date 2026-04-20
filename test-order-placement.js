// Test script to verify order placement

async function testOrderPlacement() {
  try {
    console.log('Testing order placement...');
    
    // Test data similar to what frontend sends
    const orderData = {
      products: [
        {
          productId: 'test-product-1',
          name: 'Test Product 1',
          price: 1000,
          quantity: 2,
          image: '/images/products/test.jpg',
          variant: {
            color: 'Red',
            size: 'M'
          }
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        company: '',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'India',
        phone: '+919876543210',
        email: 'test@example.com'
      },
      paymentMethod: 'Credit Card',
      paymentDetails: {
        paidAt: new Date().toISOString(),
        transactionId: 'TXN' + Date.now()
      },
      discount: 0.00,
      notes: 'Test order from test script'
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Order placed successfully!');
      console.log('Order ID:', result.data.order_id);
      console.log('Order Number:', result.data.order_number);
    } else {
      console.log('❌ Order placement failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing order placement:', error.message);
  }
}

testOrderPlacement();
