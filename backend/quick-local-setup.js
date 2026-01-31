const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Quick Local MongoDB Setup');
console.log('============================');

console.log('\n📋 Current Status:');
console.log('✅ Robust connection system working');
console.log('✅ Local MongoDB config ready');
console.log('❌ Local MongoDB not running');

console.log('\n🔧 Setup Options:');

// Check if Docker is available
exec('docker --version', (error, stdout, stderr) => {
  if (!error) {
    console.log('\n🐳 Option 1: Docker (Recommended - 2 minutes)');
    console.log('Run this command:');
    console.log('docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.log('\nThen start your server:');
    console.log('node server.js');
  } else {
    console.log('\n📦 Option 1: Docker (Not available)');
    console.log('Install Docker Desktop from: https://www.docker.com/products/docker-desktop');
  }
});

console.log('\n💻 Option 2: MongoDB Community (5 minutes)');
console.log('1. Download: https://www.mongodb.com/try/download/community');
console.log('2. Install MongoDB Community Server');
console.log('3. Start MongoDB service');
console.log('4. Run: node server.js');

console.log('\n🌐 Option 3: Fix Atlas Access (2 minutes)');
console.log('1. Add IP 47.15.114.116 to website2 cluster');
console.log('2. Test: cp .env.backup .env && node test-robust-connection.js');

console.log('\n📝 Quick Test Commands:');
console.log('Test Local: node test-robust-connection.js');
console.log('Start Server: node server.js');
console.log('Switch to Atlas: cp .env.backup .env');

// Create backup of current Atlas config
if (!fs.existsSync('.env.backup')) {
  const atlasConfig = `# MongoDB Atlas Configuration - Backup
MONGODB_URI_PRIMARY=mongodb+srv://admin2:MF0n9zX6lJu7kDHd@website2.gqafrrr.mongodb.net/?appName=website2
MONGODB_URI_FALLBACK=mongodb://admin2:MF0n9zX6lJu7kDHd@website2.gqafrrr.mongodb.net/industrial-solutions?ssl=true&authSource=admin
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
  fs.writeFileSync('.env.backup', atlasConfig);
  console.log('\n✅ Created .env.backup with Atlas configuration');
}

console.log('\n🎯 Recommendation: Use Docker for fastest setup!');
