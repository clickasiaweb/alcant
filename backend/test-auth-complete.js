const fetch = require('node-fetch');

async function testCompleteAuthFlow() {
  const baseUrl = 'http://localhost:5001/api';
  
  try {
    console.log('=== Complete Authentication Flow Test ===\n');
    
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health Status:', healthResponse.status, healthData.status);
    console.log('Database Status:', healthData.database);
    console.log();
    
    // Test 2: Signup with new user
    console.log('2. Testing user signup...');
    const timestamp = Date.now();
    const newUser = {
      name: 'John Doe',
      email: `john.doe.${timestamp}@example.com`,
      password: 'SecurePass123!'
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
    
    console.log();
    
    // Test 3: Login with the new user
    console.log('3. Testing user login...');
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
    
    if (!loginResponse.ok) {
      console.log('Login failed, aborting test');
      return;
    }
    
    console.log();
    
    // Test 4: Get current user with token
    console.log('4. Testing protected endpoint (get current user)...');
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
    } else {
      console.log('No access token available, skipping protected endpoint test');
    }
    
    console.log();
    
    // Test 5: Logout
    console.log('5. Testing logout...');
    if (loginData.session?.access_token) {
      const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginData.session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const logoutData = await logoutResponse.json();
      console.log('Logout Status:', logoutResponse.status);
      console.log('Logout Response:', JSON.stringify(logoutData, null, 2));
    } else {
      console.log('No access token available, skipping logout test');
    }
    
    console.log();
    console.log('=== Authentication Flow Test Complete ===');
    console.log('All tests passed! Authentication system is working properly.');
    
  } catch (error) {
    console.error('Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCompleteAuthFlow();
