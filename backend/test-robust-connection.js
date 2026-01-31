const { connectDB, getConnectionStatus, classifyError } = require('./config/database');
require('dotenv').config();

console.log('🧪 Testing Robust MongoDB Connection');
console.log('=====================================');

async function testRobustConnection() {
  console.log('\n📋 Test Configuration:');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Primary URI: ${process.env.MONGODB_URI_PRIMARY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`Fallback URI: ${process.env.MONGODB_URI_FALLBACK ? '✅ Configured' : '❌ Missing'}`);
  console.log(`Database Name: ${process.env.MONGODB_DB_NAME || 'industrial-solutions'}`);

  console.log('\n🔄 Starting connection test...');
  
  try {
    const connectionResult = await connectDB();
    
    if (connectionResult) {
      console.log('\n✅ Connection test PASSED');
      
      // Get and display connection status
      const status = getConnectionStatus();
      console.log('\n📊 Connection Status:');
      console.log(`Status: ${status.status}`);
      console.log(`Host: ${status.host}`);
      console.log(`Port: ${status.port}`);
      console.log(`Database: ${status.name}`);
      console.log(`Ready State: ${status.readyState}`);
      
      // Test basic database operation
      console.log('\n🔍 Testing basic database operation...');
      const mongoose = require('mongoose');
      
      // Create a simple test schema
      const TestSchema = new mongoose.Schema({
        test: String,
        timestamp: { type: Date, default: Date.now }
      });
      const TestModel = mongoose.model('TestConnection', TestSchema);
      
      // Test write operation
      const testDoc = new TestModel({ test: 'Connection test successful' });
      await testDoc.save();
      console.log('✅ Write operation successful');
      
      // Test read operation
      const foundDoc = await TestModel.findOne({ test: 'Connection test successful' });
      console.log('✅ Read operation successful');
      
      // Clean up test document
      await TestModel.deleteOne({ _id: foundDoc._id });
      console.log('✅ Cleanup operation successful');
      
      console.log('\n🎉 All database operations completed successfully!');
      
      // Close connection
      await mongoose.connection.close();
      console.log('🔌 Test connection closed');
      
    } else {
      console.log('\n❌ Connection test FAILED');
    }
    
  } catch (error) {
    console.log('\n💥 Connection test FAILED with error:');
    
    // Test error classification
    const errorClassification = classifyError(error);
    console.log('\n🔍 Error Classification:');
    console.log(`Category: ${errorClassification.category}`);
    console.log(`Code: ${errorClassification.code}`);
    console.log(`Description: ${errorClassification.description}`);
    
    console.log('\n🔧 Automated Suggestions:');
    errorClassification.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });
    
    console.log('\n📝 Full Error Details:');
    console.log(`Name: ${error.name}`);
    console.log(`Message: ${error.message}`);
    if (error.stack) {
      console.log(`Stack: ${error.stack.substring(0, 200)}...`);
    }
  }
}

// Test error classification with various error types
function testErrorClassification() {
  console.log('\n🧪 Testing Error Classification System');
  console.log('=====================================');
  
  const testErrors = [
    new Error('querySrv ECONNREFUSED _mongodb._tcp.cluster.mongodb.net'),
    new Error('getaddrinfo ENOTFOUND cluster.mongodb.net'),
    new Error('connect ECONNREFUSED 127.0.0.1:27017'),
    new Error('Authentication failed for user admin on database admin'),
    new Error('ServerSelectionTimeoutError: Server selection timed out'),
    new Error('Unknown database error occurred')
  ];
  
  testErrors.forEach((error, index) => {
    console.log(`\n📝 Test Error ${index + 1}: ${error.message}`);
    const classification = classifyError(error);
    console.log(`   Category: ${classification.category} (${classification.code})`);
    console.log(`   Description: ${classification.description}`);
    console.log(`   Suggestions: ${classification.suggestions.length} available`);
  });
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive MongoDB Connection Tests');
  console.log('==================================================');
  
  // Test error classification first
  testErrorClassification();
  
  // Test actual connection
  await testRobustConnection();
  
  console.log('\n🏁 All tests completed');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run the tests
runAllTests().catch(console.error);
