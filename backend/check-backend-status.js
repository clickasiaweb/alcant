/**
 * Backend and Database Status Check Script
 * Run this script to verify backend server and database connectivity
 */

// Load environment variables first
const dotenv = require('dotenv');
dotenv.config();

const { testConnection, getConnectionStatus } = require('./config/supabase');

async function checkBackendStatus() {
  console.log('=== Backend & Database Status Check ===\n');

  try {
    // 1. Check Environment Variables
    console.log('1. Environment Variables:');
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_KEY',
      'PORT',
      'NODE_ENV'
    ];

    let envStatus = 'OK';
    requiredEnvVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        console.log(`  ${varName}: MISSING`);
        envStatus = 'ERROR';
      } else {
        // Show masked value for sensitive data
        const maskedValue = varName.includes('KEY') || varName.includes('SECRET') 
          ? `${value.substring(0, 10)}...` 
          : value;
        console.log(`  ${varName}: ${maskedValue}`);
      }
    });

    if (envStatus === 'ERROR') {
      console.log('\n  Status: ERROR - Missing environment variables');
      console.log('  Solution: Check your .env file and ensure all required variables are set');
      return;
    }

    // 2. Check Database Connection
    console.log('\n2. Database Connection:');
    const connectionStatus = getConnectionStatus();
    console.log(`  Connected: ${connectionStatus.connected}`);
    console.log(`  Client: ${connectionStatus.client}`);
    console.log(`  URL: ${connectionStatus.url || 'Not configured'}`);

    if (!connectionStatus.connected) {
      console.log('\n  Status: ERROR - Database not connected');
      console.log('  Solution: Check SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
      return;
    }

    // 3. Test Database Query
    console.log('\n3. Database Query Test:');
    const testResult = await testConnection();
    if (testResult.success) {
      console.log(`  Status: SUCCESS`);
      console.log(`  Message: ${testResult.message}`);
    } else {
      console.log(`  Status: ERROR`);
      console.log(`  Error: ${testResult.error}`);
      console.log('  Solution: Check database permissions and table existence');
      return;
    }

    // 4. Check Required Tables
    console.log('\n4. Database Tables Check:');
    const { supabase } = require('./config/supabase');
    
    const requiredTables = [
      'products',
      'categories',
      'subcategories',
      'profiles',
      'cart_items',
      'wishlist',
      'orders'
    ];

    let tableStatus = 'OK';
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);

        if (error) {
          console.log(`  ${tableName}: ERROR - ${error.message}`);
          tableStatus = 'ERROR';
        } else {
          console.log(`  ${tableName}: OK`);
        }
      } catch (error) {
        console.log(`  ${tableName}: ERROR - ${error.message}`);
        tableStatus = 'ERROR';
      }
    }

    // 5. Check API Routes
    console.log('\n5. API Routes Status:');
    const fs = require('fs');
    const path = require('path');
    
    const routeFiles = [
      'routes/auth.js',
      'routes/products.js',
      'routes/categories.js',
      'routes/content.js',
      'routes/bulkUpload.js'
    ];

    let routeStatus = 'OK';
    routeFiles.forEach(routeFile => {
      const fullPath = path.join(__dirname, routeFile);
      if (fs.existsSync(fullPath)) {
        console.log(`  ${routeFile}: EXISTS`);
      } else {
        console.log(`  ${routeFile}: MISSING`);
        routeStatus = 'ERROR';
      }
    });

    // 6. Final Status
    console.log('\n=== Final Status ===');
    
    const overallStatus = envStatus === 'OK' && 
                        testResult.success && 
                        tableStatus === 'OK' && 
                        routeStatus === 'OK';

    if (overallStatus) {
      console.log('Status: ALL SYSTEMS OPERATIONAL');
      console.log('Backend server and database are working correctly!');
    } else {
      console.log('Status: ISSUES DETECTED');
      console.log('Please fix the errors listed above before proceeding.');
    }

    return overallStatus;

  } catch (error) {
    console.error('Critical Error:', error.message);
    console.log('Status: CRITICAL FAILURE');
    return false;
  }
}

// Check if this script is being run directly
if (require.main === module) {
  checkBackendStatus()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkBackendStatus };
