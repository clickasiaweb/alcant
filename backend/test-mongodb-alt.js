const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Alternative MongoDB Connection Test');
console.log('=====================================');

async function testAlternativeConnection() {
  try {
    // Try different connection string format
    const altUri = process.env.MONGODB_URI.replace('?appName=Cluster0', '');
    console.log('🔄 Testing alternative URI format...');
    console.log('📍 URI:', altUri);
    
    await mongoose.connect(altUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Connection details:');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port);
    console.log('   - Database:', mongoose.connection.name);
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed');
    
  } catch (error) {
    console.log('❌ Alternative connection failed');
    console.log('🔍 Trying direct TCP connection...');
    
    // Try without SRV record
    try {
      const directUri = process.env.MONGODB_URI
        .replace('mongodb+srv://', 'mongodb://')
        .replace('?appName=Cluster0', '');
      
      console.log('📍 Direct URI:', directUri);
      
      await mongoose.connect(directUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      });
      
      console.log('✅ Direct TCP connection successful!');
      await mongoose.connection.close();
      
    } catch (directError) {
      console.log('❌ Direct TCP connection also failed');
      console.log('🔍 Final Error:', directError.message);
      
      console.log('\n🔧 Recommended Solutions:');
      console.log('1. Use local MongoDB for development');
      console.log('2. Try different network (mobile hotspot)');
      console.log('3. Check if corporate firewall is blocking MongoDB');
      console.log('4. Use VPN connection');
    }
  }
}

testAlternativeConnection();
