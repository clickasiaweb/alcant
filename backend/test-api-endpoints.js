/**
 * Test API Endpoints Script
 * Test if backend server is running and API endpoints are responding
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001';

async function testAPIEndpoints() {
  console.log('=== API Endpoints Test ===\n');

  const endpoints = [
    { path: '/api/health', method: 'GET', description: 'Health Check' },
    { path: '/api/products', method: 'GET', description: 'Products List' },
    { path: '/api/categories', method: 'GET', description: 'Categories List' },
    { path: '/api/categories/all/with-subcategories', method: 'GET', description: 'Categories with Subcategories' }
  ];

  let allTestsPassed = true;

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.description} (${endpoint.method} ${endpoint.path})...`);
      
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`  Status: SUCCESS (${response.status})`);
        console.log(`  Data Type: Array.isArray(data) ? 'Array' : typeof data`);
        console.log(`  Data Length: ${Array.isArray(data) ? data.length : Object.keys(data).length}`);
      } else {
        console.log(`  Status: ERROR (${response.status})`);
        console.log(`  Error: ${response.statusText}`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`  Status: FAILED`);
      console.log(`  Error: ${error.message}`);
      allTestsPassed = false;
    }
    console.log('');
  }

  // Test server connectivity
  console.log('Server Connectivity Test:');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (response.ok) {
      console.log('  Server: RUNNING');
      console.log('  Port: 5001');
    } else {
      console.log('  Server: RESPONDING WITH ERRORS');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('  Server: NOT RUNNING');
    console.log('  Error: Cannot connect to localhost:5001');
    console.log('  Solution: Start the backend server with "npm start" or "npm run dev"');
    allTestsPassed = false;
  }

  console.log('\n=== Test Results ===');
  if (allTestsPassed) {
    console.log('Status: ALL API ENDPOINTS WORKING');
    console.log('Backend server is running and responding correctly!');
  } else {
    console.log('Status: ISSUES DETECTED');
    console.log('Some API endpoints are not working properly.');
  }

  return allTestsPassed;
}

// Check if this script is being run directly
if (require.main === module) {
  testAPIEndpoints()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testAPIEndpoints };
