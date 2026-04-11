const fetch = require('node-fetch');

async function testAuth() {
  try {
    console.log('Testing signup...');
    
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    // Test signup
    const signupResponse = await fetch('http://localhost:5001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup Response:', signupResponse.status, signupData);
    
    if (signupResponse.ok) {
      console.log('Testing login...');
      
      // Test login
      const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginResponse.status, loginData);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuth();
