#!/usr/bin/env node

// Production Deployment Script for Alcant Backend
// Deploys upload routes and static file serving to Vercel

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DEPLOYING UPLOAD ROUTES TO PRODUCTION');
console.log('=====================================\n');

// 1. Verify required files exist
console.log('📋 Verifying required files...');

const requiredFiles = [
  'server.js',
  'routes/upload.js',
  'controllers/imageUploadController.js',
  'vercel.json',
  'package.json'
];

const missingFiles = [];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('❌ Missing required files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\n❌ Cannot deploy without all required files');
  process.exit(1);
}

console.log('✅ All required files present');

// 2. Check if uploads directory exists
console.log('\n📁 Checking uploads directory...');
const uploadsDir = 'uploads';
const imagesDir = 'uploads/images';

if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
} else {
  console.log('✅ Uploads directory exists');
}

if (!fs.existsSync(imagesDir)) {
  console.log('📁 Creating images directory...');
  fs.mkdirSync(imagesDir, { recursive: true });
} else {
  console.log('✅ Images directory exists');
}

// 3. Test server.js syntax
console.log('\n🔍 Testing server.js syntax...');
try {
  require('./server.js');
  console.log('✅ server.js syntax is valid');
} catch (error) {
  console.log('❌ server.js syntax error:', error.message);
  process.exit(1);
}

// 4. Check Vercel CLI
console.log('\n🔧 Checking Vercel CLI...');
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI available');
} catch (error) {
  console.log('❌ Vercel CLI not found');
  console.log('💡 Install Vercel CLI: npm i -g vercel');
  process.exit(1);
}

// 5. Check git status
console.log('\n📊 Checking git status...');
try {
  const gitStatus = execSync('git status --porcelain', { stdio: 'pipe' });
  const hasChanges = gitStatus.stdout.trim().length > 0;
  
  if (hasChanges) {
    console.log('⚠️ Uncommitted changes detected:');
    console.log(gitStatus.stdout);
    console.log('\n💡 Commit changes before deploying:');
    console.log('   git add .');
    console.log('   git commit -m "Add upload routes to production"');
    console.log('   git push');
    console.log('\n   Then run this script again');
    process.exit(1);
  } else {
    console.log('✅ Git repository is clean');
  }
} catch (error) {
  console.log('⚠️ Git not available or not a git repository');
  console.log('💡 This is optional for deployment');
}

// 6. Deployment commands
console.log('\n🚀 DEPLOYMENT OPTIONS:');
console.log('=====================================');

console.log('Option 1: Deploy to Production (Recommended)');
console.log('   vercel --prod');

console.log('\nOption 2: Deploy to Preview (Testing)');
console.log('   vercel');

console.log('\nOption 3: Deploy with Custom Domain');
console.log('   vercel --prod --domain alcant-backend.vercel.app');

console.log('\n📋 POST-DEPLOYMENT VERIFICATION:');
console.log('=====================================');
console.log('After deployment, test these URLs:');
console.log('');
console.log('1. Backend Health:');
console.log('   curl https://alcant-backend.vercel.app/api/health');
console.log('');
console.log('2. Upload Endpoint (should return 400):');
console.log('   curl -X POST https://alcant-backend.vercel.app/api/upload/image');
console.log('');
console.log('3. Static Files:');
console.log('   curl -I https://alcant-backend.vercel.app/uploads/images/');
console.log('');
console.log('4. Image Upload Test:');
console.log('   curl -X POST https://alcant-backend.vercel.app/api/upload/image \\');
console.log('     -F "image=@test-image.jpg"');
console.log('');
console.log('5. Frontend Test:');
console.log('   https://alcant12.vercel.app (should show images)');

console.log('\n🎯 WHAT WILL BE DEPLOYED:');
console.log('=====================================');
console.log('✅ Upload Routes: /api/upload/*');
console.log('✅ Static File Serving: /uploads/*');
console.log('✅ CORS Headers: For image access');
console.log('✅ Production Uploads Directory');
console.log('✅ Environment Variables: NODE_ENV=production');
console.log('✅ Database Connection: Supabase');

console.log('\n🚀 READY TO DEPLOY!');
console.log('==================');
console.log('Choose one of the deployment options above to deploy upload routes to production.');

// Auto-deploy if requested
const args = process.argv.slice(2);
if (args.includes('--deploy') || args.includes('--prod')) {
  console.log('\n🚀 Starting deployment...');
  
  const deployCommand = args.includes('--prod') ? 'vercel --prod' : 'vercel';
  
  try {
    console.log(`📤 Running: ${deployCommand}`);
    const result = execSync(deployCommand, { stdio: 'inherit' });
    console.log('✅ Deployment completed!');
    console.log('\n🔍 Verification URLs:');
    console.log('   Health: https://alcant-backend.vercel.app/api/health');
    console.log('   Upload: https://alcant-backend.vercel.app/api/upload/image');
    console.log('   Static: https://alcant-backend.vercel.app/uploads/images/');
  } catch (error) {
    console.log('❌ Deployment failed:', error.message);
    console.log('💡 Check Vercel logs for details');
  }
}
