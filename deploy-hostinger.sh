#!/bin/bash

# Hostinger Deployment Script for Node.js Application

echo "🚀 Starting Alcant Website Deployment..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version
npm --version

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-deps

# Build applications
echo "🔨 Building applications..."
npm run build

# Set permissions
echo "🔐 Setting permissions..."
chmod +x backend/server.js

# Start the application
echo "🌟 Starting application..."
npm start
