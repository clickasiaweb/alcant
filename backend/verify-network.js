const https = require('https');

console.log('🌐 Network Verification Tool');
console.log('==========================');

async function getCurrentIP() {
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
}

async function testMongoDNS() {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec('nslookup website2.gqafrrr.mongodb.net', (error, stdout, stderr) => {
      if (error || stderr.includes('No internal type')) {
        resolve(false); // DNS failing
      } else {
        resolve(true); // DNS working
      }
    });
  });
}

async function main() {
  console.log('\n📡 Checking Network Status...');
  
  try {
    const currentIP = await getCurrentIP();
    console.log(`🌐 Your Current IP: ${currentIP}`);
    
    if (currentIP === '47.15.114.128') {
      console.log('❌ You are still on the original network');
      console.log('🔧 Please switch to mobile hotspot first');
    } else {
      console.log('✅ You appear to be on a different network');
      
      const dnsWorking = await testMongoDNS();
      if (dnsWorking) {
        console.log('✅ MongoDB DNS resolution is working');
        console.log('🚀 Try: node test-robust-connection.js');
      } else {
        console.log('❌ MongoDB DNS still blocked');
        console.log('🔧 This network also blocks MongoDB');
      }
    }
    
    console.log('\n📋 Instructions:');
    console.log('1. Switch to mobile hotspot (different IP)');
    console.log('2. Add new IP to MongoDB Atlas whitelist');
    console.log('3. Test connection: node test-robust-connection.js');
    
  } catch (error) {
    console.log('❌ Could not detect IP:', error.message);
  }
}

main();
