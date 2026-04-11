const fetch = require('node-fetch');

async function testEmailConfirmationFix() {
  const baseUrl = 'http://localhost:5001/api';
  
  try {
    console.log('=== Testing Email Confirmation Fix ===\n');
    
    // Test 1: Create a new user without email confirmation
    console.log('1. Testing signup without email confirmation...');
    const timestamp = Date.now();
    const newUser = {
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'password123'
    };
    
    const signupResponse = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup Status:', signupResponse.status);
    console.log('Signup Response:', JSON.stringify(signupData, null, 2));
    
    if (!signupResponse.ok) {
      console.log('Signup failed, aborting test');
      return;
    }
    
    console.log('\n2. Testing login with unconfirmed email...');
    
    // Test 2: Try to login with the unconfirmed email
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newUser.email,
        password: newUser.password
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.ok) {
      console.log('\n3. Testing protected endpoint...');
      
      // Test 3: Test protected endpoint
      if (loginData.session?.access_token) {
        const userResponse = await fetch(`${baseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const userData = await userResponse.json();
        console.log('Get User Status:', userResponse.status);
        console.log('User Data:', JSON.stringify(userData, null, 2));
      }
    }
    
    console.log('\n=== Email Confirmation Fix Test Complete ===');
    console.log('Expected: Login should work even without email confirmation');
    
  } catch (error) {
    console.error('Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEmailConfirmationFix();
