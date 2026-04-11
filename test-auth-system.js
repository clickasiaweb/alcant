// Test script to verify Supabase authentication system
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthenticationSystem() {
  console.log('🧪 Testing Supabase Authentication System...\n');

  const tests = [
    { name: 'Database Connection', test: testDatabaseConnection },
    { name: 'User Registration', test: testUserRegistration },
    { name: 'User Login', test: testUserLogin },
    { name: 'Profile Management', test: testProfileManagement },
    { name: 'Cart Operations', test: testCartOperations },
    { name: 'Order Creation', test: testOrderCreation },
    { name: 'Search History', test: testSearchHistory },
    { name: 'RLS Policies', test: testRLSPolicies }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔍 Running: ${test.name}`);
      const result = await test.test();
      
      if (result.success) {
        console.log(`✅ ${test.name}: PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED - ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! The Supabase authentication system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: `Connected successfully. Found ${data.length} profiles` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testUserRegistration() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Clean up any existing test user
    await supabase.auth.admin.deleteUser(testEmail);

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Clean up test user
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: 'User registration works correctly' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testUserLogin() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Failed to create test user' };
    }

    // Test login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      return { success: false, error: signInError.message };
    }

    // Clean up test user
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: 'User login works correctly' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testProfileManagement() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Failed to create test user' };
    }

    // Test profile operations
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        name: 'Updated Test User',
        phone: '+1234567890'
      })
      .eq('id', user.id)
      .select()
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Clean up test user
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: 'Profile management works correctly' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testCartOperations() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Failed to create test user' };
    }

    // Test cart operations
    const { data: cartItem, error: cartError } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: '00000000-0000-0000-0000-0001', // Dummy UUID
        quantity: 1,
        selected_color: 'Black'
      })
      .select()
      .single();

    if (cartError) {
      return { success: false, error: cartError.message };
    }

    // Test cart retrieval
    const { data: cartItems, error: retrieveError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (retrieveError) {
      return { success: false, error: retrieveError.message };
    }

    // Clean up
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: `Cart operations work correctly. Found ${cartItems.length} items` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testOrderCreation() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Failed to create test user' };
    }

    // Test order creation
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: `TEST-${Date.now()}`,
        total_amount: 99.99,
        status: 'pending',
        payment_status: 'pending',
        shipping_address: { street: '123 Test St', city: 'Test City' },
        billing_address: { street: '123 Test St', city: 'Test City' }
      })
      .select()
      .single();

    if (orderError) {
      return { success: false, error: orderError.message };
    }

    // Clean up
    await supabase.from('orders').delete().eq('user_id', user.id);
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: 'Order creation works correctly' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testSearchHistory() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Failed to create test user' };
    }

    // Test search history
    const { data: searchItem, error: searchError } = await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        search_query: 'test search query',
        results_count: 5
      })
      .select()
      .single();

    if (searchError) {
      return { success: false, error: searchError.message };
    }

    // Test search retrieval
    const { data: searchHistory, error: retrieveError } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id);

    if (retrieveError) {
      return { success: false, error: retrieveError.message };
    }

    // Clean up
    await supabase.from('search_history').delete().eq('user_id', user.id);
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: `Search history works correctly. Found ${searchHistory.length} entries` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testRLSPolicies() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Create test user
    const { data: { user } } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Failed to create test user' };
    }

    // Test RLS policies - user should only access their own data
    const { data: ownProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // User should NOT be able to access other users' data
    const { data: otherProfiles, error: otherError } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user.id)
      .limit(1);

    if (otherError) {
      return { success: false, error: otherError.message };
    }

    if (otherProfiles.length > 0) {
      return { success: false, error: 'RLS policy violation: User can access other users data' };
    }

    // Clean up
    await supabase.auth.admin.deleteUser(testEmail);

    return { success: true, data: 'RLS policies work correctly' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Run tests
testAuthenticationSystem().catch(console.error);
