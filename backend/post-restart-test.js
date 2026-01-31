const { connectDB, getConnectionStatus } = require('./config/database');
require('dotenv').config();

console.log('🔄 Post-Restart Connection Test');
console.log('==============================');

async function testAfterRestart() {
  console.log('\n📋 Testing after system restart...');
  console.log('This will help clear any DNS caching issues');
  
  try {
    console.log('\n🔄 Testing MongoDB connection...');
    const connectionResult = await connectDB();
    
    if (connectionResult) {
      console.log('\n✅ SUCCESS: MongoDB connected after restart!');
      
      const status = getConnectionStatus();
      console.log('\n📊 Connection Details:');
      console.log(`Status: ${status.status}`);
      console.log(`Host: ${status.host}`);
      console.log(`Port: ${status.port}`);
      console.log(`Database: ${status.name}`);
      
      console.log('\n🎉 You can now start the server:');
      console.log('Run: node server.js');
      
      // Close test connection
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      
    } else {
      console.log('\n❌ Still having connection issues');
      console.log('🔧 Try local MongoDB or different network');
    }
    
  } catch (error) {
    console.log('\n💥 Connection test failed after restart');
    console.log(`Error: ${error.message}`);
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Try local MongoDB: cp .env.local .env && node server.js');
    console.log('2. Try mobile hotspot for Atlas access');
    console.log('3. Install Docker for quick local MongoDB');
  }
}

console.log('\n📝 Instructions:');
console.log('1. Restart your system now');
console.log('2. Run this script after restart: node post-restart-test.js');
console.log('3. Check if DNS issues are resolved');

// Run test if called directly
if (require.main === module) {
  testAfterRestart().catch(console.error);
}

module.exports = { testAfterRestart };
