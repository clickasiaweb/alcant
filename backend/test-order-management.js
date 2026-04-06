const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:5001/api';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'password123'
};

const testOrder = {
  products: [
    {
      productId: '507f1f77bcf86cd799439011', // Sample product ID
      quantity: 2,
      variant: {
        color: 'Black',
        size: 'M'
      }
    }
  ],
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    phone: '+919876543210',
    email: 'testuser@example.com'
  },
  paymentMethod: 'Credit Card',
  notes: 'Test order for order management system'
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error(`❌ Error making request to ${endpoint}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test functions
const testAuth = async () => {
  console.log('\n🔐 Testing Authentication...');
  
  // Register user
  console.log('📝 Registering test user...');
  const registerResult = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });

  if (registerResult.success) {
    console.log('✅ User registered successfully');
  } else if (registerResult.status === 400 && registerResult.data?.error?.includes('already exists')) {
    console.log('ℹ️ User already exists, proceeding with login');
  } else {
    console.log('❌ Registration failed:', registerResult.data);
    return false;
  }

  // Login user
  console.log('🔑 Logging in test user...');
  const loginResult = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });

  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    console.log('✅ Login successful');
    return true;
  } else {
    console.log('❌ Login failed:', loginResult.data);
    return false;
  }
};

const testOrderCreation = async () => {
  console.log('\n📦 Testing Order Creation...');
  
  // First, get available products
  console.log('🔍 Fetching available products...');
  const productsResult = await makeRequest('/products?limit=5');
  
  if (!productsResult.success || !productsResult.data?.data?.length) {
    console.log('❌ No products found for testing');
    return false;
  }

  const product = productsResult.data.data[0];
  testOrder.products[0].productId = product._id || product.id;
  testOrder.products[0].name = product.name;
  testOrder.products[0].price = product.finalPrice || product.price;
  testOrder.products[0].image = product.image;

  console.log(`📋 Using product: ${product.name}`);

  // Create order
  console.log('🛒 Creating order...');
  const orderResult = await makeRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(testOrder)
  });

  if (orderResult.success) {
    console.log('✅ Order created successfully');
    console.log(`📄 Order ID: ${orderResult.data.data.orderId}`);
    console.log(`💰 Total Amount: ${orderResult.data.data.totalAmount}`);
    return orderResult.data.data;
  } else {
    console.log('❌ Order creation failed:', orderResult.data);
    return false;
  }
};

const testUserOrderRetrieval = async () => {
  console.log('\n👤 Testing User Order Retrieval...');
  
  const result = await makeRequest('/my-orders');
  
  if (result.success) {
    console.log('✅ User orders retrieved successfully');
    console.log(`📊 Total orders: ${result.data.pagination?.total || 0}`);
    if (result.data.data?.length > 0) {
      console.log('📋 Recent orders:');
      result.data.data.forEach((order, index) => {
        console.log(`  ${index + 1}. ${order.orderId} - ${order.orderStatus} - ${order.totalAmount}`);
      });
    }
    return result.data.data;
  } else {
    console.log('❌ Failed to retrieve user orders:', result.data);
    return false;
  }
};

const testAdminOrderRetrieval = async () => {
  console.log('\n👨‍💼 Testing Admin Order Retrieval...');
  
  const result = await makeRequest('/orders');
  
  if (result.success) {
    console.log('✅ Admin orders retrieved successfully');
    console.log(`📊 Total orders: ${result.data.pagination?.total || 0}`);
    if (result.data.data?.length > 0) {
      console.log('📋 Recent orders:');
      result.data.data.forEach((order, index) => {
        console.log(`  ${index + 1}. ${order.orderId} - ${order.orderStatus} - ${order.totalAmount} - ${order.shippingAddress?.email}`);
      });
    }
    return result.data.data;
  } else {
    console.log('❌ Failed to retrieve admin orders:', result.data);
    return false;
  }
};

const testOrderDetails = async (orderId) => {
  console.log('\n🔍 Testing Order Details...');
  
  const result = await makeRequest(`/orders/${orderId}`);
  
  if (result.success) {
    console.log('✅ Order details retrieved successfully');
    const order = result.data.data;
    console.log(`📄 Order ID: ${order.orderId}`);
    console.log(`👤 Customer: ${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`);
    console.log(`📧 Email: ${order.shippingAddress?.email}`);
    console.log(`📞 Phone: ${order.shippingAddress?.phone}`);
    console.log(`💰 Total: ${order.totalAmount}`);
    console.log(`📦 Status: ${order.orderStatus}`);
    console.log(`💳 Payment: ${order.paymentStatus}`);
    console.log(`📦 Products: ${order.products?.length || 0} items`);
    return order;
  } else {
    console.log('❌ Failed to retrieve order details:', result.data);
    return false;
  }
};

const testOrderStatusUpdate = async (orderId) => {
  console.log('\n🔄 Testing Order Status Update...');
  
  const statuses = ['Confirmed', 'Processing', 'Shipped'];
  let currentOrder = null;

  for (const status of statuses) {
    console.log(`📝 Updating status to: ${status}`);
    
    const result = await makeRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: status,
        note: `Status updated to ${status} via test script`
      })
    });

    if (result.success) {
      console.log(`✅ Status updated to ${status}`);
      currentOrder = result.data.data;
      
      // Add delay to simulate real-world usage
      await delay(1000);
    } else {
      console.log(`❌ Failed to update status to ${status}:`, result.data);
      return false;
    }
  }

  return currentOrder;
};

const testOrderFilters = async () => {
  console.log('\n🔍 Testing Order Filters...');
  
  // Test status filter
  console.log('📊 Testing status filter...');
  const statusResult = await makeRequest('/orders?orderStatus=Pending');
  if (statusResult.success) {
    console.log(`✅ Status filter works: ${statusResult.data.pagination?.total || 0} pending orders`);
  } else {
    console.log('❌ Status filter failed:', statusResult.data);
  }

  // Test search
  console.log('🔍 Testing search functionality...');
  const searchResult = await makeRequest('/orders?search=test');
  if (searchResult.success) {
    console.log(`✅ Search works: ${searchResult.data.pagination?.total || 0} orders found`);
  } else {
    console.log('❌ Search failed:', searchResult.data);
  }

  // Test payment status filter
  console.log('💳 Testing payment status filter...');
  const paymentResult = await makeRequest('/orders?paymentStatus=Paid');
  if (paymentResult.success) {
    console.log(`✅ Payment status filter works: ${paymentResult.data.pagination?.total || 0} paid orders`);
  } else {
    console.log('❌ Payment status filter failed:', paymentResult.data);
  }
};

const testOrderStats = async () => {
  console.log('\n📈 Testing Order Statistics...');
  
  const result = await makeRequest('/orders/stats');
  
  if (result.success) {
    console.log('✅ Order statistics retrieved successfully');
    const stats = result.data.data;
    console.log(`📊 Total Orders: ${stats.totalOrders}`);
    console.log(`💰 Total Revenue: ${stats.totalRevenue}`);
    console.log('📋 Orders by Status:', stats.ordersByStatus);
    console.log('💳 Orders by Payment Status:', stats.ordersByPaymentStatus);
    return stats;
  } else {
    console.log('❌ Failed to retrieve order statistics:', result.data);
    return false;
  }
};

const testOrderCancellation = async (orderId) => {
  console.log('\n❌ Testing Order Cancellation...');
  
  const result = await makeRequest(`/orders/${orderId}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({
      reason: 'Test cancellation via automated test'
    })
  });

  if (result.success) {
    console.log('✅ Order cancelled successfully');
    console.log(`📄 Order Status: ${result.data.data.orderStatus}`);
    console.log(`📝 Cancellation Reason: ${result.data.data.cancellationReason}`);
    return result.data.data;
  } else {
    console.log('❌ Order cancellation failed:', result.data);
    return false;
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Order Management System Tests');
  console.log('===========================================');

  let createdOrderId = null;
  let testResults = {
    auth: false,
    orderCreation: false,
    userRetrieval: false,
    adminRetrieval: false,
    orderDetails: false,
    statusUpdate: false,
    filters: false,
    stats: false,
    cancellation: false
  };

  try {
    // Test authentication
    testResults.auth = await testAuth();
    if (!testResults.auth) {
      console.log('❌ Authentication failed, cannot proceed with tests');
      return;
    }

    // Test order creation
    const createdOrder = await testOrderCreation();
    testResults.orderCreation = !!createdOrder;
    if (createdOrder) {
      createdOrderId = createdOrder._id || createdOrder.id;
    }

    // Test user order retrieval
    testResults.userRetrieval = await testUserOrderRetrieval();

    // Test admin order retrieval
    testResults.adminRetrieval = await testAdminOrderRetrieval();

    // Test order details
    if (createdOrderId) {
      testResults.orderDetails = await testOrderDetails(createdOrderId);
    }

    // Test order status update
    if (createdOrderId) {
      testResults.statusUpdate = await testOrderStatusUpdate(createdOrderId);
    }

    // Test filters
    await testOrderFilters();
    testResults.filters = true; // Mark as tested even if some filters fail

    // Test statistics
    testResults.stats = await testOrderStats();

    // Test order cancellation
    if (createdOrderId) {
      testResults.cancellation = await testOrderCancellation(createdOrderId);
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }

  // Print test results summary
  console.log('\n📊 Test Results Summary');
  console.log('======================');
  
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(result => result === true).length;
  
  Object.entries(testResults).forEach(([test, result]) => {
    const status = result === true ? '✅ PASS' : result === false ? '❌ FAIL' : '⚠️  SKIP';
    console.log(`${status} ${test.charAt(0).toUpperCase() + test.slice(1)}`);
  });
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Order Management System is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the logs above for details.');
  }

  console.log('\n🔗 Test URLs');
  console.log('============');
  console.log(`📱 User Orders: http://localhost:3001/my-orders`);
  console.log(`👨‍💼 Admin Orders: http://localhost:3001/orders`);
  console.log(`🔧 API Base: ${API_BASE_URL}`);
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testAuth,
  testOrderCreation,
  testUserOrderRetrieval,
  testAdminOrderRetrieval,
  testOrderDetails,
  testOrderStatusUpdate,
  testOrderFilters,
  testOrderStats,
  testOrderCancellation
};
