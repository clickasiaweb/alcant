// Test if we can reach Supabase from production environment
const https = require('https');

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connectivity to Supabase
    const response = await fetch('https://fkjqbzfpwtoqgptygupl.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Supabase REST API reachable:', data);
    } else {
      console.error('❌ Supabase REST API not reachable:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testSupabaseConnection();
