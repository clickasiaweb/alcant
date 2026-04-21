// Debug script to check what the backend is actually sending
const fetch = require('node-fetch');

async function debugOrderCreation() {
  try {
    console.log('🔍 Debugging order creation...');
    
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
      discount: 0,
      notes: 'Debug order creation'
    };

    console.log('📤 Sending data:', JSON.stringify(orderData, null, 2));

    const response = await fetch('https://alcant-backend.vercel.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Debug-Script/1.0'
      },
      body: JSON.stringify(orderData)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);

    try {
      const result = JSON.parse(responseText);
      console.log('📥 Parsed response:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('📥 Response is not JSON:', responseText);
    }

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugOrderCreation();
