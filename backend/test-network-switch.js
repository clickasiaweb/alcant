const { connectDB, getConnectionStatus } = require('./config/database');
require('dotenv').config();

console.log('🌐 Network Connection Test');
console.log('========================');
console.log('Instructions:');
console.log('1. Switch to mobile hotspot or different network');
console.log('2. Run this script: node test-network-switch.js');
console.log('3. Compare results with previous network\n');

async function testNetworkConnection() {
  console.log(`📡 Current Network Test`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  console.log('\n🔄 Testing MongoDB connection...');
  
  try {
    const connectionResult = await connectDB();
    
    if (connectionResult) {
      console.log('\n✅ SUCCESS: MongoDB connected successfully!');
      
      const status = getConnectionStatus();
      console.log('\n📊 Connection Details:');
      console.log(`Status: ${status.status}`);
      console.log(`Host: ${status.host}`);
      console.log(`Port: ${status.port}`);
      console.log(`Database: ${status.name}`);
      
      console.log('\n🎉 Network test PASSED - Your new network works!');
      console.log('💡 You can now start the server with: node server.js');
      
      // Close the test connection
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      console.log('🔌 Test connection closed');
      
    } else {
      console.log('\n❌ FAILED: Connection still not working');
      console.log('🔧 Try another network or check IP whitelist');
    }
    
  } catch (error) {
    console.log('\n💥 Connection test FAILED');
    console.log(`Error: ${error.message}`);
    
    if (error.message.includes('whitelisted')) {
      console.log('\n🔧 SOLUTION: Add your new IP to MongoDB Atlas whitelist');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Network Access → Add IP Address');
      console.log('   3. Add current IP address');
    }
    
    if (error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 SOLUTION: This network still has DNS blocking');
      console.log('   1. Try another network (different mobile carrier)');
      console.log('   2. Or use VPN connection');
    }
  }
}

// Run the test
testNetworkConnection().catch(console.error);
