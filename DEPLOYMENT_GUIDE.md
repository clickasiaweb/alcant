# Deployment Guide: Backend & Admin Panel

## Overview
- **Backend**: Node.js/Express API with Supabase database
- **Admin Panel**: React SPA (Create React App)
- **Frontend**: Next.js (already deployed on Vercel)

---

## 🚀 Backend Deployment Options

### Option 1: Vercel (Recommended)
**Pros**: Free, easy, integrates with frontend
**Cons**: Serverless functions (some limitations)

#### Steps:
1. **Create `vercel.json` in backend folder:**
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
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key",
    "NODE_ENV": "production"
  }
}
```

2. **Create `.env.production` in backend folder:**
```env
SUPABASE_URL=https://db.orhcxgmjychxcrqqwcqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaGN4Z21qeWNoeGNycXF3Y3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjIwODQsImV4cCI6MjA4NDgzODA4NH0.lHKuN5EKkVmCMF-u3PKmDSXkkS2k8k52hQhZ2M5zdNg
NODE_ENV=production
```

3. **Deploy to Vercel:**
   - Push backend to separate GitHub repo OR
   - Use Vercel CLI: `vercel --prod` in backend folder

### Option 2: Railway (Easy Alternative)
**Pros**: Simple Node.js deployment
**Cons**: Limited free tier

#### Steps:
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables in Railway dashboard
4. Railway auto-deploys

### Option 3: DigitalOcean/Heroku (Advanced)
**Pros**: Full control, scalable
**Cons**: More complex, paid

---

## 🎛️ Admin Panel Deployment Options

### Option 1: Vercel Static Site
**Pros**: Free, fast CDN
**Cons**: Build-time only

#### Steps:
1. **Create `vercel.json` in admin-panel folder:**
```json
{
  "version": 2,
  "name": "alcant-admin",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_API_URL": "@backend_url"
  }
}
```

2. **Create `.env.production` in admin-panel folder:**
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

3. **Deploy to Vercel**

### Option 2: Netlify (Alternative)
**Pros**: Free, easy
**Cons**: Build-time only

#### Steps:
1. Push admin-panel to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`

---

## 🔧 Configuration Updates Needed

### 1. Update Frontend API URL
After deploying backend, update frontend environment:

**In `frontend/.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### 2. Update Admin Panel API URL
**In `admin-panel/.env.production`:**
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

---

## 📋 Deployment Checklist

### Backend:
- [ ] Supabase credentials configured
- [ ] Environment variables set
- [ ] CORS allows frontend/admin URLs
- [ ] Database connection tested
- [ ] All endpoints working

### Admin Panel:
- [ ] API URL configured
- [ ] Build process successful
- [ ] Authentication working
- [ ] All pages accessible

### Frontend:
- [ ] API URL updated to point to deployed backend
- [ ] Categories/products loading from API
- [ ] Mock data removed (optional)

---

## 🌐 Final URLs Structure
```
Frontend: https://alcant-website.vercel.app
Backend:  https://alcant-backend.vercel.app
Admin:   https://alcant-admin.vercel.app
```

---

## 🐛 Troubleshooting

### Backend Issues:
- **CORS errors**: Add frontend/admin URLs to CORS config
- **Database connection**: Check Supabase credentials
- **Environment variables**: Verify all required vars are set

### Admin Panel Issues:
- **API connection**: Check REACT_APP_API_URL
- **Build errors**: Verify all dependencies installed
- **404 errors**: Check routing configuration

### Frontend Issues:
- **API not working**: Update NEXT_PUBLIC_API_URL
- **Categories not loading**: Check backend deployment
- **Mixed content**: Ensure HTTPS everywhere

---

## 🚀 Quick Start Commands

```bash
# Backend
cd backend
npm install
npm start

# Admin Panel  
cd admin-panel
npm install
npm start

# Frontend (already deployed)
cd frontend
npm install
npm run dev
```

---

## 💡 Pro Tips

1. **Use separate repositories** for each service
2. **Set up auto-deployment** from GitHub
3. **Monitor logs** in deployment dashboards
4. **Test locally** before deploying
5. **Use environment-specific** configurations
6. **Set up custom domains** for production
7. **Configure SSL certificates** (usually automatic)
8. **Set up monitoring** and error tracking
