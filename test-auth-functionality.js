// Test script to verify authentication functionality
import { authService } from './frontend/lib/supabaseAuth.js';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Sign up a new user
    console.log('1️⃣ Testing signup...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123456!';
    
    const signupResult = await authService.signUp(testEmail, testPassword, {
      name: 'Test User',
      phone: '+1234567890'
    });
    
    console.log('✅ Signup successful:', signupResult);
    console.log('📧 User created:', signupResult.user?.email);
    console.log('📧 Session created:', !!signupResult.session);

    // Test 2: Sign in with the new user
    console.log('\n2️⃣ Testing signin...');
    const signinResult = await authService.signIn(testEmail, testPassword);
    
    console.log('✅ Signin successful:', signinResult);
    console.log('📧 User logged in:', signinResult.user?.email);
    console.log('📧 Session active:', !!signinResult.session);

    // Test 3: Get user profile
    console.log('\n3️⃣ Testing profile fetch...');
    if (signinResult.user) {
      const profile = await authService.getUserProfile(signinResult.user.id);
      console.log('✅ Profile fetched:', profile);
      console.log('👤 Name:', profile?.name);
      console.log('📧 Email:', profile?.email);
    }

    // Test 4: Check authentication status
    console.log('\n4️⃣ Testing auth status...');
    const isAuth = authService.isAuthenticated();
    console.log('✅ User authenticated:', isAuth);

    console.log('\n🎉 All authentication tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.error('📋 Full error:', error);
  }
}

// Run the test
testAuth();
