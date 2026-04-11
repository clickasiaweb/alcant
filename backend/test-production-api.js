/**
 * Test Production API Endpoints
 * Test the production backend URL that the frontend uses
 */

const fetch = require('node-fetch');

const PRODUCTION_URL = 'https://alcant-backend.vercel.app';

async function testProductionAPI() {
  console.log('=== Production API Test ===');
  console.log(`Testing: ${PRODUCTION_URL}\n`);

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
      
      const response = await fetch(`${PRODUCTION_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Backend-Test-Script/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`  Status: SUCCESS (${response.status})`);
        console.log(`  Data Type: ${Array.isArray(data) ? 'Array' : typeof data}`);
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

  console.log('=== Production API Test Results ===');
  if (allTestsPassed) {
    console.log('Status: PRODUCTION API WORKING');
    console.log('Production backend is accessible and responding correctly!');
  } else {
    console.log('Status: PRODUCTION API ISSUES');
    console.log('Production backend has issues that need to be addressed.');
  }

  return allTestsPassed;
}

// Check if this script is being run directly
if (require.main === module) {
  testProductionAPI()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Production API test failed:', error);
      process.exit(1);
    });
}

module.exports = { testProductionAPI };
