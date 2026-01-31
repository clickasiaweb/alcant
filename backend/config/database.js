const mongoose = require('mongoose');

// Configure mongoose for strict query handling
mongoose.set("strictQuery", false);

/**
 * Error classification utility
 */
const classifyError = (error) => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('querysrv') || errorMessage.includes('enotfound') || errorMessage.includes('dns')) {
    return {
      category: 'DNS_RESOLUTION_ERROR',
      code: 'DNS_001',
      description: 'DNS SRV lookup failed - likely ISP or network restriction',
      suggestions: [
        'Try using mobile hotspot or different network',
        'Check if corporate/college firewall blocks DNS SRV',
        'Consider using VPN connection',
        'Fallback to non-SRV URI should resolve this'
      ]
    };
  }
  
  if (errorMessage.includes('econnrefused') || errorMessage.includes('connection refused')) {
    return {
      category: 'NETWORK_REFUSAL',
      code: 'NET_001',
      description: 'Network connection refused - firewall or routing issue',
      suggestions: [
        'Check firewall settings for MongoDB port 27017',
        'Verify IP whitelist in MongoDB Atlas',
        'Try different network connection',
        'Ensure IPv4 routing is enforced'
      ]
    };
  }
  
  if (errorMessage.includes('authentication') || errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return {
      category: 'AUTHENTICATION_ERROR',
      code: 'AUTH_001',
      description: 'Authentication failed - credentials or permissions issue',
      suggestions: [
        'Verify username and password',
        'Check database user permissions',
        'Ensure IP is whitelisted in MongoDB Atlas',
        'Validate database name exists'
      ]
    };
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('serverselectiontimeout')) {
    return {
      category: 'TIMEOUT_ERROR',
      code: 'TIME_001',
      description: 'Connection timeout - network latency or server unresponsive',
      suggestions: [
        'Increase timeout values',
        'Check network connectivity to MongoDB Atlas',
        'Verify cluster status in MongoDB Atlas',
        'Try closer geographic region'
      ]
    };
  }
  
  return {
    category: 'UNKNOWN_ERROR',
    code: 'UNK_001',
    description: 'Unclassified error occurred',
    suggestions: [
      'Check MongoDB Atlas cluster status',
      'Verify network connectivity',
      'Review error logs for details',
      'Contact support if issue persists'
    ]
  };
};

/**
 * Structured logging utility
 */
const logConnectionAttempt = (type, uri, error = null, connectionInfo = null) => {
  const timestamp = new Date().toISOString();
  const nodeVersion = process.version;
  const platform = process.platform;
  const networkFamily = 'IPv4'; // We enforce IPv4
  
  if (error) {
    const errorClassification = classifyError(error);
    console.error(`\n🔴 MongoDB Connection Failed`);
    console.error(`=====================================`);
    console.error(`Timestamp: ${timestamp}`);
    console.error(`Connection Type: ${type}`);
    console.error(`Error Category: ${errorClassification.category} (${errorClassification.code})`);
    console.error(`Description: ${errorClassification.description}`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Node.js Version: ${nodeVersion}`);
    console.error(`Platform: ${platform}`);
    console.error(`Network Family: ${networkFamily}`);
    console.error(`\n🔧 Suggested Solutions:`);
    errorClassification.suggestions.forEach((suggestion, index) => {
      console.error(`${index + 1}. ${suggestion}`);
    });
    console.error(`=====================================\n`);
  } else {
    console.log(`\n✅ MongoDB Connected Successfully`);
    console.log(`=====================================`);  
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Connection Type: ${type}`);
    console.log(`Node.js Version: ${nodeVersion}`);
    console.log(`Platform: ${platform}`);
    console.log(`Network Family: ${networkFamily}`);
    if (connectionInfo) {
      console.log(`Host: ${connectionInfo.host}`);
      console.log(`Port: ${connectionInfo.port}`);
      console.log(`Database: ${connectionInfo.name}`);
    }
    console.log(`=====================================\n`);
  }
};

/**
 * Generate fallback URI from SRV URI
 */
const generateFallbackUri = (srvUri) => {
  try {
    // Convert mongodb+srv:// to mongodb://
    const fallbackUri = srvUri.replace('mongodb+srv://', 'mongodb://');
    
    // Remove appName parameter if present
    const cleanedUri = fallbackUri.replace(/\?appName=[^&]*/, '');
    
    return cleanedUri;
  } catch (error) {
    console.error('Error generating fallback URI:', error.message);
    return null;
  }
};

/**
 * Robust MongoDB connection with dual URI support
 */
const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI_PRIMARY;
  const fallbackUri = process.env.MONGODB_URI_FALLBACK;
  const dbName = process.env.MONGODB_DB_NAME || 'industrial-solutions';
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Connection options with IPv4 enforcement
  const connectionOptions = {
    dbName: dbName,
    family: 4, // Force IPv4
    serverSelectionTimeoutMS: 10000, // 10 second timeout
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  // Determine which URI to try first based on environment
  let primaryConnectionUri, fallbackConnectionUri;
  
  if (nodeEnv === 'development') {
    // In development, prefer fallback (non-SRV) to avoid DNS issues
    primaryConnectionUri = fallbackUri || generateFallbackUri(primaryUri);
    fallbackConnectionUri = primaryUri;
  } else {
    // In staging/production, prefer SRV with fallback
    primaryConnectionUri = primaryUri;
    fallbackConnectionUri = fallbackUri || generateFallbackUri(primaryUri);
  }

  console.log(`🚀 Starting MongoDB connection in ${nodeEnv} environment`);
  console.log(`📡 Primary URI Type: ${primaryConnectionUri.includes('+srv') ? 'SRV' : 'Direct'}`);
  console.log(`📡 Fallback URI Type: ${fallbackConnectionUri.includes('+srv') ? 'SRV' : 'Direct'}`);

  // Attempt primary connection
  try {
    await mongoose.connect(primaryConnectionUri, connectionOptions);
    
    const connectionInfo = {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
    
    logConnectionAttempt('PRIMARY', primaryConnectionUri, null, connectionInfo);
    console.log('🎯 MongoDB connected using primary URI');
    return true;
    
  } catch (primaryError) {
    logConnectionAttempt('PRIMARY', primaryConnectionUri, primaryError);
    
    // If fallback URI is available, try it
    if (fallbackConnectionUri && fallbackConnectionUri !== primaryConnectionUri) {
      console.log('🔄 Attempting fallback connection...');
      
      try {
        await mongoose.connect(fallbackConnectionUri, connectionOptions);
        
        const connectionInfo = {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name
        };
        
        logConnectionAttempt('FALLBACK', fallbackConnectionUri, null, connectionInfo);
        console.log('🎯 MongoDB connected using fallback URI');
        return true;
        
      } catch (fallbackError) {
        logConnectionAttempt('FALLBACK', fallbackConnectionUri, fallbackError);
        
        console.error('\n💥 CRITICAL: Both primary and fallback connections failed');
        console.error('=====================================');
        console.error('Application cannot start without database connection.');
        console.error('Please resolve the connectivity issues and restart the application.');
        console.error('=====================================\n');
        
        // Exit with specific error code for database connection failure
        process.exit(1);
      }
    } else {
      console.error('\n💥 CRITICAL: No fallback URI available and primary connection failed');
      console.error('=====================================');
      console.error('Please configure MONGODB_URI_FALLBACK in your environment variables.');
      console.error('=====================================\n');
      process.exit(1);
    }
  }
};

/**
 * Graceful database disconnection
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected gracefully');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
  }
};

/**
 * Database connection status checker
 */
const getConnectionStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: states[state] || 'unknown',
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    readyState: state
  };
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Mongoose connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  classifyError
};
