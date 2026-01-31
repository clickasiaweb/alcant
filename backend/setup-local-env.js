const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Connection Setup Helper');
console.log('==================================');

// Get current IP address
async function getPublicIP() {
  try {
    const https = require('https');
    return new Promise((resolve, reject) => {
      https.get('https://api.ipify.org?format=json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const ip = JSON.parse(data).ip;
            resolve(ip);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  } catch (error) {
    return 'Unable to fetch IP';
  }
}

// Create local MongoDB environment file
function createLocalEnv() {
  const localEnvContent = `# Local MongoDB Configuration (for development)
MONGODB_URI_PRIMARY=mongodb://localhost:27017/industrial-solutions
MONGODB_URI_FALLBACK=mongodb://localhost:27017/industrial-solutions
MONGODB_DB_NAME=industrial-solutions

# Environment
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# API Port
PORT=5000

# CORS Origin
CORS_ORIGIN=http://localhost:3000

# Admin Panel URL
ADMIN_ORIGIN=http://localhost:3001
`;

  fs.writeFileSync(path.join(__dirname, '.env.local'), localEnvContent);
  console.log('✅ Created .env.local for local MongoDB');
}

// Main setup function
async function setup() {
  console.log('\n📋 Connection Issues Detected:');
  console.log('1. IP Whitelist Issue - Your IP needs to be added to MongoDB Atlas');
  console.log('2. DNS SRV Blocking - ISP is blocking MongoDB DNS lookups');
  
  console.log('\n🔧 Available Solutions:');
  console.log('Option 1: Add IP to Atlas Whitelist (Recommended)');
  console.log('Option 2: Use Local MongoDB for Development');
  console.log('Option 3: Try VPN + Different Network');
  
  // Try to get public IP
  try {
    const publicIP = await getPublicIP();
    console.log(`\n🌐 Your Public IP: ${publicIP}`);
    console.log('Add this IP to MongoDB Atlas: https://cloud.mongodb.com/');
    console.log('Navigate to: Network Access → Add IP Address');
  } catch (error) {
    console.log('\n🌐 Unable to fetch public IP automatically');
  }
  
  // Create local environment file
  createLocalEnv();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Add your IP to MongoDB Atlas whitelist');
  console.log('2. OR install local MongoDB and use .env.local');
  console.log('3. Then run: node server.js');
  
  console.log('\n🚀 Quick Test Commands:');
  console.log('Test Atlas: node test-robust-connection.js');
  console.log('Test Local: cp .env.local .env && node server.js');
}

setup().catch(console.error);
