#!/bin/bash

# Hostinger Deployment Script
# Usage: ./deploy.sh [frontend|admin|backend|all]

set -e

MODULE=${1:-all}
HOSTINGER_USER="your_username"
HOSTINGER_SERVER="your-server-ip"
DOMAIN="example.com"

echo "🚀 Starting deployment for: $MODULE"

# Function to deploy backend
deploy_backend() {
    echo "📦 Deploying backend..."
    ssh $HOSTINGER_USER@$HOSTINGER_SERVER << 'EOF'
cd /home/your_username/backend
git pull origin main
npm install
pm2 restart industrial-solutions-api
echo "✅ Backend deployed successfully"
EOF
}

# Function to deploy frontend
deploy_frontend() {
    echo "🎨 Deploying frontend..."
    cd frontend
    npm run build
    
    # Upload to Hostinger (requires scp or rsync)
    echo "📤 Uploading frontend files..."
    # scp -r out/* $HOSTINGER_USER@$HOSTINGER_SERVER:/public_html/
    echo "✅ Frontend build completed. Upload manually to /public_html/"
}

# Function to deploy admin
deploy_admin() {
    echo "⚙️ Deploying admin panel..."
    cd admin-panel
    npm run build
    
    # Upload to Hostinger
    echo "📤 Uploading admin files..."
    # scp -r build/* $HOSTINGER_USER@$HOSTINGER_SERVER:/public_html/admin/
    echo "✅ Admin build completed. Upload manually to /public_html/admin/"
}

# Deploy based on module
case $MODULE in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "admin")
        deploy_admin
        ;;
    "all")
        deploy_backend
        deploy_frontend
        deploy_admin
        ;;
    *)
        echo "❌ Invalid module. Use: frontend, admin, backend, or all"
        exit 1
        ;;
esac

echo "🎉 Deployment completed!"
