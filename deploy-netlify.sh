#!/bin/bash

# Netlify Deployment Script for Alcant Website

echo "🚀 Deploying to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the project
echo "🔨 Building project..."
cd frontend
npm run build
cd ..

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=frontend/out

echo "✅ Deployment complete!"
