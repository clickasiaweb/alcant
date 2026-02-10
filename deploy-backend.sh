#!/bin/bash

# Backend Deployment Script for Hostinger API Subdomain
# Deploys backend to api.your-domain.com

echo "🚀 BACKEND DEPLOYMENT"
echo "===================="

# Configuration
BACKEND_DIR="backend"
HOSTINGER_USER="your_username"
HOSTINGER_SERVER="your-server-ip"
API_SUBDOMAIN="api.your-domain.com"
PORT=3000

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install --production

if [ $? -ne 0 ]; then
    echo "❌ Error: Backend dependencies installation failed"
    exit 1
fi

echo "✅ Backend dependencies installed successfully"

echo "🔧 Checking environment files..."
if [ ! -f ".env.production" ]; then
    echo "⚠️ Warning: .env.production file not found"
    echo "📋 Create .env.production with:"
    echo "NODE_ENV=production"
    echo "PORT=3000"
    echo "DATABASE_URL=your_supabase_url"
    echo "SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "CORS_ORIGIN=https://your-domain.com"
fi

echo "📤 Preparing for deployment..."
echo "📁 Backend directory contents:"
ls -la

echo ""
echo "🌐 DEPLOYMENT INSTRUCTIONS"
echo "=========================="
echo ""
echo "Upload the contents of '$BACKEND_DIR/' to your Hostinger API subdomain:"
echo ""
echo "📋 Manual Upload Steps:"
echo "1. Login to Hostinger Control Panel"
echo "2. Go to Subdomains → Create New"
echo "3. Create 'api' subdomain pointing to /api directory"
echo "4. Upload all files from '$BACKEND_DIR/' to /api/"
echo "5. Enable Node.js in Advanced → Node.js"
echo "6. Set startup file: server.js"
echo "7. Set port: 3000"
echo ""
echo "🔧 Alternative - SCP Command:"
echo "scp -r * $HOSTINGER_USER@$HOSTINGER_SERVER:/api/"
echo ""
echo "🔧 Alternative - FTP:"
echo "Upload '$BACKEND_DIR/' contents to /api/ subdirectory"
echo ""
echo "🔧 Environment Setup:"
echo "1. In Hostinger Panel → Advanced → Node.js"
echo "2. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=3000"
echo "   - DATABASE_URL=your_supabase_url"
echo "   - SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   - CORS_ORIGIN=https://your-domain.com"
echo ""
echo "✅ Backend is ready for deployment!"
echo "🌐 After deployment, API will be at: https://$API_SUBDOMAIN"
echo "🔧 Test API: https://$API_SUBDOMAIN/health"
