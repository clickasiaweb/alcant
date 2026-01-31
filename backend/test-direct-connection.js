const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Direct MongoDB Connection Test');
console.log('================================');

async function testDirectConnection() {
  try {
    // Try with different connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    console.log('🔄 Attempting direct connection...');
    console.log('📍 URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Connection details:');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port);
    console.log('   - Database:', mongoose.connection.name);
    
    // Test basic operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Existing collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully');
    
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('🔍 Error details:');
    console.log('   - Type:', error.constructor.name);
    console.log('   - Message:', error.message);
    
    if (error.message.includes('querySrv')) {
      console.log('\n🔧 DNS Resolution Issue Detected');
      console.log('💡 Solutions:');
      console.log('1. Try using local MongoDB');
      console.log('2. Change your DNS to 8.8.8.8 (Google DNS)');
      console.log('3. Use VPN if network restrictions exist');
    }
  }
}

testDirectConnection();
