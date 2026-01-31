const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 MongoDB Connection Test');
console.log('==========================');

// Test basic connectivity
async function testConnection() {
  try {
    console.log('📍 Testing MongoDB URI:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing');
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in .env file');
      return;
    }

    console.log('🔄 Attempting to connect...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database info:');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port);
    console.log('   - Name:', mongoose.connection.name);

    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    const TestModel = mongoose.model('Test', testSchema);

    await TestModel.create({ name: 'Connection Test' });
    console.log('✅ Successfully created test document');

    await TestModel.deleteMany({});
    console.log('✅ Cleaned up test documents');

    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');

  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('Error details:');
    console.log('   - Name:', error.name);
    console.log('   - Message:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Check MongoDB Atlas cluster status');
      console.log('2. Configure IP whitelist in Atlas Network Access');
      console.log('3. Verify database user credentials');
      console.log('4. Check internet connection');
    }
  }
}

testConnection();
