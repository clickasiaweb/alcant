# 🚀 Alcant Website Deployment Guide

## 📋 Overview
This guide covers the deployment of the Alcant website to Vercel with the following domains:
- **Frontend**: https://alcant12.vercel.app
- **Backend**: https://alcant-backend.vercel.app  
- **Admin Panel**: https://admin.alcant.in

## 🏗️ Project Structure
```
WEBSITE1/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
├── admin-panel/       # React admin panel
└── DEPLOYMENT.md      # This deployment guide
```

## 🔧 Environment Variables

### Frontend (Next.js)
**File**: `frontend/.env.production`
```env
NEXT_PUBLIC_SUPABASE_URL=https://db.orhcxgmjychxcrqqwcqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://alcant-backend.vercel.app/api
NODE_ENV=production
```

### Backend (Node.js)
**File**: `backend/.env.production`
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
JWT_SECRET=93342746-fd5c-4320-b777-c9a17b36b590
SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CORS_ORIGIN=https://alcant12.vercel.app
ADMIN_ORIGIN=https://admin.alcant.in
```

### Admin Panel (React)
**File**: `admin-panel/.env`
```env
REACT_APP_API_URL=https://alcant-backend.vercel.app/api
REACT_APP_SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📦 Vercel Configuration Files

### Frontend vercel.json
```json
{
  "version": 2,
  "name": "alcant-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "NEXT_PUBLIC_API_URL": "@backend-url"
  },
  "domains": ["alcant12.vercel.app"],
  "regions": ["iad1"]
}
```

### Backend vercel.json
```json
{
  "version": 2,
  "name": "alcant-backend",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_KEY": "@supabase-service-key",
    "NODE_ENV": "production",
    "JWT_SECRET": "@jwt-secret",
    "CORS_ORIGIN": "@cors-origin",
    "ADMIN_ORIGIN": "@admin-origin"
  },
  "domains": ["alcant-backend.vercel.app"],
  "regions": ["iad1"]
}
```

### Admin Panel vercel.json
```json
{
  "version": 2,
  "name": "alcant-admin",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_API_URL": "@backend-url",
    "REACT_APP_SUPABASE_URL": "@supabase-url",
    "REACT_APP_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "domains": ["admin.alcant.in"],
  "regions": ["iad1"]
}
```

## 🚀 Deployment Steps

### 1. Backend Deployment (First)
```bash
# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY  
# - SUPABASE_SERVICE_KEY
# - JWT_SECRET
# - CORS_ORIGIN: https://alcant12.vercel.app
# - ADMIN_ORIGIN: https://admin.alcant.in
```

### 2. Frontend Deployment (Second)
```bash
# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_API_URL: https://alcant-backend.vercel.app/api
```

### 3. Admin Panel Deployment (Third)
```bash
# Navigate to admin panel directory
cd admin-panel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# - REACT_APP_API_URL: https://alcant-backend.vercel.app/api
# - REACT_APP_SUPABASE_URL
# - REACT_APP_SUPABASE_ANON_KEY
```

## 🔐 Vercel Environment Variables Setup

### Required Environment Variables

#### Backend (alcant-backend.vercel.app)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `JWT_SECRET`: Your JWT secret for authentication
- `CORS_ORIGIN`: https://alcant12.vercel.app
- `ADMIN_ORIGIN`: https://admin.alcant.in

#### Frontend (alcant12.vercel.app)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_API_URL`: https://alcant-backend.vercel.app/api

#### Admin Panel (admin.alcant.in)
- `REACT_APP_API_URL`: https://alcant-backend.vercel.app/api
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🌐 Custom Domain Setup

### For admin.alcant.in
1. Go to Vercel dashboard → Project Settings → Domains
2. Add custom domain: `admin.alcant.in`
3. Configure DNS records as provided by Vercel
4. Wait for SSL certificate issuance

## ✅ Pre-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Backend API endpoints are working
- [ ] Supabase connection is configured
- [ ] CORS settings are properly configured
- [ ] Custom domains are configured (if applicable)
- [ ] SSL certificates are issued
- [ ] Build processes complete successfully

## 🔄 Post-Deployment Verification

### Backend Tests
```bash
# Test API endpoints
curl https://alcant-backend.vercel.app/api/health
curl https://alcant-backend.vercel.app/api/categories/hierarchy
curl https://alcant-backend.vercel.app/api/content/home-hero
```

### Frontend Tests
- Visit https://alcant12.vercel.app
- Check if content loads from backend
- Test navigation and sub-subcategories
- Verify responsive design

### Admin Panel Tests
- Visit https://admin.alcant.in
- Test login functionality
- Verify content management features
- Test file uploads and content saving

## 🐛 Common Issues & Solutions

### CORS Issues
If you encounter CORS errors:
1. Verify CORS_ORIGIN is set correctly in backend
2. Check that the frontend URL is whitelisted
3. Ensure backend is deployed before frontend

### Environment Variable Issues
If environment variables aren't loading:
1. Verify variable names match exactly
2. Check Vercel dashboard environment variables
3. Restart the deployment after changes

### Build Failures
If build fails:
1. Check package.json scripts
2. Verify all dependencies are installed
3. Check for any syntax errors in code

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check this documentation for common solutions

---

**🎉 Your Alcant website is now ready for production deployment!**
