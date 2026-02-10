#!/bin/bash

# Admin Panel Deployment Script for Hostinger
# Deploys admin panel to admin.your-domain.com

echo "🚀 ADMIN PANEL DEPLOYMENT"
echo "========================"

# Configuration
ADMIN_DIR="admin-panel"
BUILD_DIR="build"
HOSTINGER_USER="your_username"
HOSTINGER_SERVER="your-server-ip"
ADMIN_SUBDOMAIN="admin.your-domain.com"

# Check if admin-panel directory exists
if [ ! -d "$ADMIN_DIR" ]; then
    echo "❌ Error: admin-panel directory not found"
    exit 1
fi

echo "📦 Installing admin panel dependencies..."
cd "$ADMIN_DIR"
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Admin panel dependencies installation failed"
    exit 1
fi

echo "🔨 Building admin panel for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Admin panel build failed"
    exit 1
fi

echo "✅ Admin panel build completed successfully"

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
echo "Upload the contents of '$ADMIN_DIR/$BUILD_DIR/' to your Hostinger admin subdomain:"
echo ""
echo "📋 Manual Upload Steps:"
echo "1. Login to Hostinger Control Panel"
echo "2. Go to Subdomains → Create New"
echo "3. Create 'admin' subdomain pointing to /admin directory"
echo "4. Upload all files from '$ADMIN_DIR/$BUILD_DIR/' to /admin/"
echo "5. Set up basic authentication (optional)"
echo ""
echo "🔧 Alternative - SCP Command:"
echo "scp -r $BUILD_DIR/* $HOSTINGER_USER@$HOSTINGER_SERVER:/admin/"
echo ""
echo "🔧 Alternative - FTP:"
echo "Upload '$ADMIN_DIR/$BUILD_DIR/' contents to /admin/ subdirectory"
echo ""
echo "🔒 Security Recommendations:"
echo "1. Enable HTTPS for admin subdomain"
echo "2. Set up basic authentication"
echo "3. Use strong admin passwords"
echo "4. Enable IP whitelisting if possible"
echo ""
echo "✅ Admin panel is ready for deployment!"
echo "🌐 After deployment, admin will be at: https://$ADMIN_SUBDOMAIN"
