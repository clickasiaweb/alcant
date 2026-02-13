#!/bin/bash

# Hostinger Deployment Script
echo "Starting deployment to Hostinger..."

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Create deployment package
echo "Creating deployment package..."
mkdir -p deploy
cp -r frontend/out/* deploy/
cp -r backend deploy/
cp -r admin-panel deploy/

# Create .htaccess for frontend
cat > deploy/.htaccess << 'EOF'
# Enable URL rewriting
RewriteEngine On

# Handle static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirect API requests to backend
RewriteRule ^api/(.*)$ backend/index.php [L,QSA]

# Handle frontend routing
RewriteRule ^(.*)$ index.html [L,QSA]
EOF

# Create backend startup script
cat > deploy/start.sh << 'EOF'
#!/bin/bash
cd backend
export NODE_ENV=production
npm install
npm start
EOF

chmod +x deploy/start.sh

echo "Deployment package created in 'deploy' folder"
echo "Ready to upload to Hostinger!"
