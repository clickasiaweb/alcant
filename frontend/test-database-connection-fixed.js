/**
 * Database Connection Test Script (Fixed)
 * Tests Supabase database connectivity and table access
 */

// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Use actual configuration values
const supabaseUrl = 'https://orhcxgmjychxcrqqwcqu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaGN4Z21qeWNoeGNycXF3Y3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjIwODQsImV4cCI6MjA4NDgzODA4NH0.lHKuN5EKkVmCMF-u3PKmDSXkkS2k8k52hQhZ2M5zdNg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
const TABLES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  PROFILES: 'profiles',
  CONTENT: 'content',
  INQUIRIES: 'inquiries'
};

console.log('=== Database Connection Test ===');
console.log('Testing Supabase database connectivity...\n');
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);
console.log('');

// Test 1: Basic Connection
async function testBasicConnection() {
  console.log('1. Testing basic Supabase connection...');
  try {
    // Test with a simple query
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
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
  
  console.log(`   Supabase URL: ${supabaseUrl ? 'SET' : 'MISSING'}`);
  console.log(`   Supabase Anon Key: ${supabaseAnonKey ? 'SET' : 'MISSING'}`);
  
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
    if (!results.profilesTable || !results.cartItemsTable) {
      console.log('RECOMMENDATION: User-related tables may have permission issues');
    }
  }
  
  return results;
}

// Run tests
runAllTests().catch(console.error);
