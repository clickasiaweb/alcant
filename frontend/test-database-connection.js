/**
 * Database Connection Test Script
 * Tests Supabase database connectivity and table access
 */

// Import Supabase client
import { supabase, TABLES } from './lib/supabase.js';

console.log('=== Database Connection Test ===');
console.log('Testing Supabase database connectivity...\n');

// Test 1: Basic Connection
async function testBasicConnection() {
  console.log('1. Testing basic Supabase connection...');
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.error('   Connection failed:', error);
      return false;
    }
    console.log('   Connection successful');
    return true;
  } catch (error) {
    console.error('   Connection error:', error);
    return false;
  }
}

// Test 2: Products Table Access
async function testProductsTable() {
  console.log('2. Testing products table access...');
  try {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('id, name, price')
      .limit(1);
    
    if (error) {
      console.error('   Products table error:', error);
      return false;
    }
    
    console.log(`   Products table accessible (${data.length} records found)`);
    return true;
  } catch (error) {
    console.error('   Products table error:', error);
    return false;
  }
}

// Test 3: Categories Table Access
async function testCategoriesTable() {
  console.log('3. Testing categories table access...');
  try {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('   Categories table error:', error);
      return false;
    }
    
    console.log(`   Categories table accessible (${data.length} records found)`);
    return true;
  } catch (error) {
    console.error('   Categories table error:', error);
    return false;
  }
}

// Test 4: Profiles Table Access
async function testProfilesTable() {
  console.log('4. Testing profiles table access...');
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('id, email')
      .limit(1);
    
    if (error) {
      console.error('   Profiles table error:', error);
      return false;
    }
    
    console.log(`   Profiles table accessible (${data.length} records found)`);
    return true;
  } catch (error) {
    console.error('   Profiles table error:', error);
    return false;
  }
}

// Test 5: Cart Items Table Access
async function testCartItemsTable() {
  console.log('5. Testing cart_items table access...');
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('id, user_id, product_id')
      .limit(1);
    
    if (error) {
      console.error('   Cart items table error:', error);
      return false;
    }
    
    console.log(`   Cart items table accessible (${data.length} records found)`);
    return true;
  } catch (error) {
    console.error('   Cart items table error:', error);
    return false;
  }
}

// Test 6: Orders Table Access
async function testOrdersTable() {
  console.log('6. Testing orders table access...');
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, status')
      .limit(1);
    
    if (error) {
      console.error('   Orders table error:', error);
      return false;
    }
    
    console.log(`   Orders table accessible (${data.length} records found)`);
    return true;
  } catch (error) {
    console.error('   Orders table error:', error);
    return false;
  }
}

// Test 7: Authentication Session
async function testAuthSession() {
  console.log('7. Testing authentication session...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('   Auth session error:', error);
      return false;
    }
    
    if (session) {
      console.log(`   Auth session active (User: ${session.user.email})`);
    } else {
      console.log('   No active auth session (user not logged in)');
    }
    
    return true;
  } catch (error) {
    console.error('   Auth session error:', error);
    return false;
  }
}

// Test 8: Environment Variables
function testEnvironmentVariables() {
  console.log('8. Testing environment variables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  console.log(`   Supabase URL: ${supabaseUrl ? 'SET' : 'MISSING'}`);
  console.log(`   Supabase Anon Key: ${supabaseAnonKey ? 'SET' : 'MISSING'}`);
  console.log(`   API URL: ${apiUrl ? 'SET' : 'MISSING'}`);
  
  return !!(supabaseUrl && supabaseAnonKey);
}

// Main test runner
async function runAllTests() {
  console.log('Starting database connection tests...\n');
  
  const results = {
    basicConnection: await testBasicConnection(),
    productsTable: await testProductsTable(),
    categoriesTable: await testCategoriesTable(),
    profilesTable: await testProfilesTable(),
    cartItemsTable: await testCartItemsTable(),
    ordersTable: await testOrdersTable(),
    authSession: await testAuthSession(),
    environmentVars: testEnvironmentVariables()
  };
  
  console.log('\n=== Test Results ===');
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('All tests passed! Database connection is working properly.');
  } else {
    console.log('Some tests failed. Check the errors above.');
    
    // Specific recommendations
    if (!results.environmentVars) {
      console.log('RECOMMENDATION: Check your environment variables in .env file');
    }
    if (!results.authSession) {
      console.log('RECOMMENDATION: User authentication may have issues');
    }
    if (!results.productsTable || !results.categoriesTable) {
      console.log('RECOMMENDATION: Core tables may be missing or inaccessible');
    }
  }
  
  return results;
}

// Export for use in other scripts
export { runAllTests };

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}
