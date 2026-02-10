#!/bin/bash

# Hostinger Node.js Deployment Script
# Usage: ./deploy.sh [frontend|admin|backend|all]

set -e

MODULE=${1:-all}
PROJECT_NAME="alcant"
HOSTINGER_USER="your_username"
HOSTINGER_SERVER="your-server-ip"
DOMAIN="your-domain.com"

echo "🚀 Starting deployment for: $MODULE"

# Function to deploy backend
deploy_backend() {
    echo "📦 Deploying backend..."
    cd backend
    npm install --production
    echo "✅ Backend dependencies installed"
    
    # For Hostinger Node.js hosting
    echo "🌐 Backend ready for Node.js deployment"
    echo "Upload backend folder to your Hostinger Node.js hosting"
}

# Function to deploy frontend
deploy_frontend() {
    echo "🎨 Deploying frontend..."
    cd frontend
    npm run build
    echo "✅ Frontend build completed"
    echo "📤 Upload frontend/out folder to your Hostinger public_html directory"
}

# Function to deploy admin
deploy_admin() {
    echo "⚙️ Deploying admin panel..."
    cd admin-panel
    npm run build
    echo "✅ Admin panel build completed"
    echo "📤 Upload admin-panel/build folder to your Hostinger public_html/admin directory"
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
