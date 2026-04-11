// Test signup functionality
import { authService } from './frontend/lib/supabaseAuth.js';

async function testSignup() {
  console.log('🧪 Testing Signup Functionality...\n');

  try {
    const testEmail = `testuser${Date.now()}@alcant.com`;
    const testPassword = 'Test123456!';
    
    console.log('1️⃣ Attempting to create new user...');
    console.log('📧 Email:', testEmail);
    
    const result = await authService.signUp(testEmail, testPassword, {
      name: 'Test User',
      phone: '+1234567890'
    });
    
    if (result.user) {
      console.log('✅ User created successfully!');
      console.log('👤 User ID:', result.user.id);
      console.log('📧 User Email:', result.user.email);
      console.log('📋 Session created:', !!result.session);
      
      // Test login with the new user
      console.log('\n2️⃣ Testing login with new credentials...');
      const loginResult = await authService.signIn(testEmail, testPassword);
      
      if (loginResult.user) {
        console.log('✅ Login successful!');
        console.log('👤 Logged in user:', loginResult.user.email);
        console.log('📋 Session active:', !!loginResult.session);
        
        // Test profile retrieval
        console.log('\n3️⃣ Testing profile retrieval...');
        const profile = await authService.getUserProfile(loginResult.user.id);
        console.log('✅ Profile retrieved:', profile);
        console.log('👤 Name:', profile?.name);
        console.log('📧 Email:', profile?.email);
        
      } else {
        console.log('❌ Login failed after signup');
      }
    } else {
      console.log('❌ Signup failed');
      console.log('📋 Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSignup();
