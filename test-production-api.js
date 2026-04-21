// Test production API endpoint
async function testProductionAPI() {
  try {
    console.log('Testing production API...');
    
    const orderData = {
      products: [
        {
          productId: 'test-product-1',
          name: 'Test Product 1',
          price: 1000,
          quantity: 2,
          image: '/images/products/default.jpg',
          variant: {
            color: 'Red',
            size: 'M'
          }
        }
      ],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+919876543210',
        address: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      paymentMethod: 'Credit Card',
      paymentDetails: {
        paidAt: new Date().toISOString(),
        transactionId: 'TXN' + Date.now()
      },
      discount: 0.00,
      notes: 'Test order from production API test'
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    const response = await fetch('https://alcant-backend.vercel.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Order placed successfully!');
      console.log('Order ID:', result.data.order_id);
    } else {
      console.log('❌ Order placement failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing production API:', error.message);
  }
}

testProductionAPI();
