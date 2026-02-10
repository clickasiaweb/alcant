# 🚀 Hostinger Deployment Guide

## Prerequisites

- Hostinger Node.js Hosting plan
- Domain configured in Hostinger hPanel
- SSH access to your Hostinger account
- GitHub repositories for each module

## 1. Server Setup

### 1.1 Generate SSH Key on Hostinger

```bash
# SSH into your Hostinger server
ssh username@your-server-ip

# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
# Press Enter for all prompts (no passphrase)

# Copy public key
cat ~/.ssh/id_rsa.pub
```

### 1.2 Add SSH Key to GitHub

1. Copy the public key output
2. Go to GitHub → Settings → SSH and GPG keys
3. Click "New SSH key"
4. Paste the public key

## 2. Backend Deployment

### 2.1 Clone Repository

```bash
cd /home/username
git clone git@github.com:your-username/industrial-solutions-backend.git backend
cd backend
```

### 2.2 Setup Environment

```bash
# Copy production environment template
cp .env.production .env

# Edit with your actual values
nano .env
```

### 2.3 Install Dependencies & Start

```bash
npm install
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### 2.4 Configure Hostinger hPanel

In Hostinger hPanel → Node.js Hosting:

| Field | Value |
|-------|-------|
| App Root | `/home/username/backend` |
| Startup File | `server.js` |
| Node Version | 18 |
| App URL | `api.example.com` |

## 3. Frontend Deployment

### 3.1 Build Locally

```bash
cd frontend
npm install
npm run build
```

### 3.2 Upload to Hostinger

```bash
# Upload contents of frontend/out/ to /public_html/
# Using FileZilla or Hostinger File Manager:
# - Connect to your server
# - Navigate to /public_html/
# - Upload all files from frontend/out/
```

## 4. Admin Panel Deployment

### 4.1 Build Locally

```bash
cd admin-panel
npm install
npm run build
```

### 4.2 Upload to Hostinger

```bash
# Create admin directory in public_html
mkdir -p /public_html/admin

# Upload contents of admin-panel/build/ to /public_html/admin/
# Using FileZilla or Hostinger File Manager:
# - Navigate to /public_html/admin/
# - Upload all files from admin-panel/build/
```

## 5. Subdomain Configuration

### 5.1 Configure in Hostinger hPanel

1. Go to Domains → Subdomains
2. Create subdomains:
   - `admin.example.com` → `/public_html/admin`
   - `api.example.com` → Node.js App (configured in step 2.4)

### 5.2 Update Environment Files

**Frontend (.env.production):**
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

**Admin Panel (.env.production):**
```
REACT_APP_API_URL=https://api.example.com
```

## 6. Testing & Verification

```bash
# Test backend
curl https://api.example.com/api/health

# Test frontend
# Visit https://example.com in browser

# Test admin panel
# Visit https://admin.example.com in browser
```

## 7. Update Workflow

### Backend Updates

```bash
cd /home/username/backend
git pull
npm install
pm2 restart industrial-solutions-api
```

### Frontend Updates

```bash
# Locally:
cd frontend
npm run build
# Upload frontend/out/ to /public_html/

# Admin Panel:
cd admin-panel  
npm run build
# Upload admin-panel/build/ to /public_html/admin/
```

## 8. Troubleshooting

### Backend Issues

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs industrial-solutions-api

# Restart
pm2 restart industrial-solutions-api
```

### CORS Issues

Ensure your backend CORS configuration includes:
- `https://example.com`
- `https://admin.example.com`

### Environment Variables

Verify all required variables are set in `.env`:
- Database credentials
- JWT secrets
- API keys

## 9. Security Checklist

- [ ] SSH keys configured (no password auth)
- [ ] Environment variables set correctly
- [ ] CORS properly configured
- [ ] PM2 auto-restart enabled
- [ ] SSL certificates active
- [ ] No sensitive data in code repositories
