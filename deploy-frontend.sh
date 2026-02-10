#!/bin/bash

# Frontend Deployment Script for Hostinger
# Deploys frontend to main domain

echo "🚀 FRONTEND DEPLOYMENT"
echo "====================="

# Configuration
FRONTEND_DIR="frontend"
BUILD_DIR="out"
HOSTINGER_USER="your_username"
HOSTINGER_SERVER="your-server-ip"
DOMAIN="your-domain.com"

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: frontend directory not found"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Frontend dependencies installation failed"
    exit 1
fi

echo "🔨 Building frontend for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Frontend build failed"
    exit 1
fi

echo "✅ Frontend build completed successfully"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Error: Build directory ($BUILD_DIR) not found"
    exit 1
fi

echo "📤 Preparing for deployment..."
echo "📁 Build directory contents:"
ls -la "$BUILD_DIR"

echo ""
echo "🌐 DEPLOYMENT INSTRUCTIONS"
echo "=========================="
echo ""
echo "Upload the contents of '$FRONTEND_DIR/$BUILD_DIR/' to your Hostinger main domain:"
echo ""
echo "📋 Manual Upload Steps:"
echo "1. Login to Hostinger Control Panel"
echo "2. Go to File Manager → public_html/"
echo "3. Upload all files from '$FRONTEND_DIR/$BUILD_DIR/'"
echo "4. Ensure index.html is in the root"
echo ""
echo "🔧 Alternative - SCP Command:"
echo "scp -r $BUILD_DIR/* $HOSTINGER_USER@$HOSTINGER_SERVER:/public_html/"
echo ""
echo "🔧 Alternative - FTP:"
echo "Upload '$FRONTEND_DIR/$BUILD_DIR/' contents to public_html/"
echo ""
echo "✅ Frontend is ready for deployment!"
echo "🌐 After deployment, visit: https://$DOMAIN"
