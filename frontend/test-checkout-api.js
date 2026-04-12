/**
 * Test Checkout API from Frontend Context
 * This simulates what the checkout page does
 */

// Test the exact same logic as checkout page
async function testCheckoutAPICall() {
  console.log('=== Testing Checkout API Call (Frontend Simulation) ===');
  
  try {
    // Simulate cart items (same as checkout page)
    const cartItems = [
      {
        id: 'test-product-789',
        name: 'Test Product',
        price: 1500,
        quantity: 1,
        image: '/images/test.jpg',
        final_price: 1500
      }
    ];
    
    // Simulate shipping info (same as checkout page)
    const shippingInfo = {
      firstName: 'Frontend',
      lastName: 'Test User',
      email: 'frontend@example.com',
      phone: '1234567890',
      address: '123 Frontend Street',
      city: 'Frontend City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    };
    
    // Simulate billing info (same as checkout page)
    const billingInfo = {
      firstName: 'Frontend',
      lastName: 'Test User',
      email: 'frontend@example.com',
      address: '123 Frontend Street',
      city: 'Frontend City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country'
    };
    
    // Prepare order data exactly as checkout page does
    const orderData = {
      products: cartItems.map(item => ({
        productId: item.id,
        name: item.name || `Product ${item.id}`,
        price: item.price || item.final_price || 1000,
        quantity: item.quantity,
        image: item.image || '/images/products/default.jpg',
        variant: {
          color: item.selected_color || 'Standard',
          size: item.selected_size || 'Standard'
        }
      })),
      shippingAddress: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        company: shippingInfo.company,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        phone: shippingInfo.phone,
        email: shippingInfo.email
      },
      billingAddress: {
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        company: billingInfo.company,
        address: billingInfo.address,
        city: billingInfo.city,
        state: billingInfo.state,
        postalCode: billingInfo.zipCode,
        country: billingInfo.country,
        phone: billingInfo.phone,
        email: billingInfo.email
      },
      paymentMethod: 'Credit Card',
      paymentDetails: {
        paidAt: new Date().toISOString(),
        transactionId: 'TXN' + Date.now()
      },
      notes: 'Test order from frontend simulation'
    };
    
    console.log('Order data prepared:', JSON.stringify(orderData, null, 2));
    
    // Make API call exactly as checkout page does
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('API Response Status:', response.status);
    const result = await response.json();
    console.log('API Response:', result);
    
    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', result.data.order_id);
      console.log('   Order Number:', result.data.order_number);
      console.log('   Total Amount:', result.data.total_amount);
    } else {
      console.log('❌ Order creation failed:', result.error);
    }
    
  } catch (error) {
    console.error('Error in frontend API test:', error);
  }
}

// Run the test
testCheckoutAPICall();
