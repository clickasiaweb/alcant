// Debug script to check cart items and checkout flow

async function debugCheckoutFlow() {
  try {
    console.log('🔍 Debugging checkout flow...');
    
    // 1. Simulate cart items (as they would come from frontend)
    console.log('\n1. Simulating cart items...');
    const mockCartItems = [
      {
        id: 'mock-product-1',
        product_id: 'mock-product-1',
        name: 'Mock Product',
        price: 1000,
        quantity: 1,
        image: '/images/products/default.jpg',
        selected_color: 'Standard',
        selected_size: 'Standard'
      }
    ];
    
    console.log('Mock cart items:', mockCartItems);
    
    // 3. Test order data creation (similar to checkout.jsx)
    console.log('\n3. Creating order data...');
    const orderData = {
      products: mockCartItems.map(item => ({
        productId: item.product_id || item.id,
        name: item.name || `Product ${item.product_id}`,
        price: item.price || 1000,
        quantity: item.quantity,
        image: item.image || '/images/products/default.jpg',
        variant: {
          color: item.selected_color || item.variant || 'Standard',
          size: item.selected_size || 'Standard'
        }
      })),
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'India'
      },
      paymentMethod: 'Credit Card',
      paymentDetails: {
        paidAt: new Date().toISOString(),
        transactionId: 'TXN' + Date.now()
      },
      discount: 0.00,
      notes: 'Debug test order'
    };
    
    console.log('Order data to be sent:', JSON.stringify(orderData, null, 2));
    
    // 4. Test API call
    console.log('\n4. Testing API call...');
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Order placement successful!');
      console.log('Order ID:', result.data.order_id);
    } else {
      console.log('❌ Order placement failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugCheckoutFlow();
