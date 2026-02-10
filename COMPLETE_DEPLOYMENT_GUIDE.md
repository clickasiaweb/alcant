# 🚀 ALCANT DEPLOYMENT GUIDE

## 📋 Project Structure Overview

```
alcant/
├── frontend/           # Next.js React app → Main Domain
├── backend/            # Node.js API → API Subdomain  
├── admin-panel/        # React admin → Admin Subdomain
└── deploy.sh          # Deployment script
```

## 🌐 Deployment Architecture

### Main Domain: `your-domain.com`
- **Content**: Frontend static files
- **Source**: `frontend/out/` (built from `frontend/`)
- **Type**: Static HTML/CSS/JS

### API Subdomain: `api.your-domain.com`
- **Content**: Backend API endpoints
- **Source**: `backend/` directory
- **Type**: Node.js Express server

### Admin Subdomain: `admin.your-domain.com`
- **Content**: Admin interface
- **Source**: `admin-panel/build/` (built from `admin-panel/`)
- **Type**: Static HTML/CSS/JS

## 🛠️ Pre-Deployment Setup

### 1. Configure Environment Variables

#### Backend (.env.production)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CORS_ORIGIN=https://your-domain.com
```

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Update Hostinger Configuration

#### In deploy.sh
```bash
HOSTINGER_USER="your_hostinger_username"
HOSTINGER_SERVER="your_hostinger_server_ip"
DOMAIN="your-domain.com"
```

## 🚀 Deployment Steps

### Option 1: Automated Deployment Script

```bash
# Deploy all components
./deploy.sh all

# Deploy specific components
./deploy.sh frontend
./deploy.sh backend
./deploy.sh admin
```

### Option 2: Manual Deployment

#### Step 1: Build Frontend
```bash
cd frontend
npm install
npm run build
# Upload frontend/out/ to main domain public_html/
```

#### Step 2: Deploy Backend
```bash
cd backend
npm install --production
# Upload entire backend/ to api subdomain
# Start Node.js server
npm start
```

#### Step 3: Build Admin Panel
```bash
cd admin-panel
npm install
npm run build
# Upload admin-panel/build/ to admin subdomain
```

## 📁 File Upload Methods

### Method 1: FTP/File Manager
1. **Frontend**: Upload `frontend/out/` contents to `public_html/`
2. **Backend**: Upload `backend/` to `api/` subdirectory
3. **Admin**: Upload `admin-panel/build/` to `admin/` subdirectory

### Method 2: SSH/SCP
```bash
# Frontend
scp -r frontend/out/* user@hostinger:/public_html/

# Backend
scp -r backend/* user@hostinger:/api/

# Admin
scp -r admin-panel/build/* user@hostinger:/admin/
```

### Method 3: Git (Recommended)
```bash
# Main domain - static files
git clone https://github.com/your-repo.git
cd frontend && npm run build
cp -r out/* /public_html/

# API subdomain - Node.js app
cd /api
git clone https://github.com/your-repo.git
cd backend && npm install --production
npm start
```

## 🔧 Hostinger Control Panel Setup

### Main Domain Configuration
1. **Hosting → Manage → Advanced**
2. **PHP Version**: 8.x
3. **Document Root**: `/public_html`
4. **SSL Certificate**: Enable

### API Subdomain Setup
1. **Subdomains → Create New**
2. **Subdomain**: `api`
3. **Document Root**: `/api`
4. **Node.js**: Enable
5. **Port**: 3000

### Admin Subdomain Setup
1. **Subdomains → Create New**
2. **Subdomain**: `admin`
3. **Document Root**: `/admin`
4. **Static Files**: HTML/CSS/JS

## 🌍 DNS Configuration

### Required Records
```
A Record: your-domain.com → [Hostinger IP]
A Record: api.your-domain.com → [Hostinger IP]
A Record: admin.your-domain.com → [Hostinger IP]
CNAME: www.your-domain.com → your-domain.com
```

## 🔒 Security Configuration

### CORS Setup (Backend)
```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Environment Variables
- Never commit `.env.production` files
- Use Hostinger environment variables panel
- Rotate API keys regularly

## 📊 Testing & Verification

### Frontend Testing
1. Visit `https://your-domain.com`
2. Check all pages load correctly
3. Test responsive design
4. Verify API calls work

### Backend Testing
1. Visit `https://api.your-domain.com/health`
2. Test API endpoints with Postman
3. Check database connectivity
4. Verify CORS is working

### Admin Panel Testing
1. Visit `https://admin.your-domain.com`
2. Test login functionality
3. Verify CRUD operations
4. Check data persistence

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Hostinger
        run: |
          # Add your deployment script here
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Frontend built successfully
- [ ] Admin panel built successfully
- [ ] Backend dependencies installed
- [ ] DNS records configured
- [ ] SSL certificates installed
- [ ] CORS settings updated
- [ ] API endpoints tested
- [ ] Frontend loads on main domain
- [ ] Admin panel accessible
- [ ] Database connectivity verified
- [ ] Error monitoring setup

## 🚨 Troubleshooting

### Common Issues

#### Frontend Not Loading
- Check `frontend/out/` directory exists
- Verify files uploaded to correct `public_html/`
- Check `.htaccess` configuration

#### API Not Responding
- Verify Node.js process is running
- Check port 3000 is open
- Review backend logs

#### CORS Errors
- Verify CORS origin settings
- Check API URL in frontend
- Ensure HTTPS is used

#### Database Connection Issues
- Verify Supabase credentials
- Check network connectivity
- Review environment variables

## 📞 Support

If you encounter issues:
1. Check Hostinger error logs
2. Verify file permissions
3. Test with different browsers
4. Contact Hostinger support if needed

**Your Alcant website is now ready for deployment!** 🎉
