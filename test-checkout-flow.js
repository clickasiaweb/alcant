// Test script to simulate adding items to cart and testing checkout flow

// Mock localStorage for Node.js environment
global.localStorage = {
  data: {},
  setItem: function(key, value) {
    this.data[key] = value;
  },
  getItem: function(key) {
    return this.data[key] || null;
  },
  removeItem: function(key) {
    delete this.data[key];
  }
};

// Simulate adding items to localStorage cart (as frontend would do)
function setupTestCart() {
  const testCart = [
    {
      id: 'test-product-1',
      product_id: 'test-product-1',
      name: 'Test Product 1',
      displayName: 'Test Product 1',
      price: 1000,
      originalPrice: 1000,
      quantity: 2,
      image: '/images/products/default.jpg',
      category: 'Test Category',
      variant: 'Red',
      selected_color: 'Red',
      selected_size: 'M',
      inStock: true,
      slug: 'test-product-1',
      description: 'Test product description',
      images: ['/images/products/default.jpg']
    },
    {
      id: 'test-product-2',
      product_id: 'test-product-2',
      name: 'Test Product 2',
      displayName: 'Test Product 2',
      price: 500,
      originalPrice: 500,
      quantity: 1,
      image: '/images/products/default.jpg',
      category: 'Test Category',
      variant: 'Blue',
      selected_color: 'Blue',
      selected_size: 'L',
      inStock: true,
      slug: 'test-product-2',
      description: 'Test product description',
      images: ['/images/products/default.jpg']
    }
  ];
  
  localStorage.setItem('localCart', JSON.stringify(testCart));
  console.log('Test cart setup complete. Items:', testCart.length);
  return testCart;
}

// Test order placement with cart items
async function testCheckoutWithCart() {
  try {
    console.log('=== Testing Checkout Flow ===');
    
    // Setup test cart
    const cartItems = setupTestCart();
    
    // Calculate totals (same as checkout page)
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping above 1000
    const totalAmount = subtotal + tax + shipping;
    
    console.log('Cart Summary:');
    console.log('- Subtotal:', subtotal);
    console.log('- Tax:', tax);
    console.log('- Shipping:', shipping);
    console.log('- Total:', totalAmount);
    
    // Prepare order data (same as checkout page)
    const orderData = {
      products: cartItems.map(item => ({
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
      notes: 'Test order from checkout flow'
    };
    
    console.log('\nSending order to API...');
    
    // Test API call
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('\n=== Order Placed Successfully! ===');
      console.log('Order ID:', result.data.order_id);
      console.log('Order Number:', result.data.order_number);
      console.log('Total Amount:', result.data.total_amount);
      console.log('Products:', result.data.products.length);
      console.log('Payment Status:', result.data.payment_status);
      console.log('Order Status:', result.data.order_status);
      
      // Clear cart after successful order (simulate checkout behavior)
      localStorage.removeItem('localCart');
      console.log('\nCart cleared after successful order');
      
      return true;
    } else {
      console.error('Order placement failed:', result.message);
      return false;
    }
    
  } catch (error) {
    console.error('Error in checkout flow:', error);
    return false;
  }
}

// Run the test
testCheckoutWithCart().then(success => {
  if (success) {
    console.log('\n=== Checkout Flow Test PASSED ===');
  } else {
    console.log('\n=== Checkout Flow Test FAILED ===');
  }
});
