# Free Deployment Setup Guide

## Option 1: Vercel (Recommended)

### Frontend + Backend on Vercel

#### Step 1: Move Backend API Routes
Create API routes in `frontend/pages/api/`:

```
frontend/
├── pages/
│   ├── api/
│   │   ├── products.js
│   │   ├── auth.js
│   │   └── [all other backend routes]
│   ├── _app.jsx
│   └── index.jsx
```

#### Step 2: Update Backend Controllers
Convert Express routes to Vercel API routes format.

#### Step 3: Deploy to Vercel
1. Go to vercel.com
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Deploy automatically

### Benefits:
- Frontend: https://your-app.vercel.app
- Backend API: https://your-app.vercel.app/api/*
- Free SSL certificate
- Automatic deployments

## Option 2: Netlify + Render

### Frontend on Netlify
1. Go to netlify.com
2. Import GitHub repository
3. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/out`
4. Deploy

### Backend on Render
1. Go to render.com
2. New Web Service
3. Connect GitHub repository
4. Build command: `cd backend && npm install`
5. Start command: `npm start`
6. Deploy

## Option 3: Railway

### All Services on Railway
1. Go to railway.app
2. New Project
3. Deploy from GitHub repo
4. Railway auto-detects services
5. Configure environment variables

## Option 4: Glitch

### Quick Deployment
1. Go to glitch.com
2. New project
3. Import from GitHub
4. Glitch auto-deploys

## Environment Variables for All Platforms

Required for all deployments:
```
NODE_ENV=production
SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=93342746-fd5c-4320-b777-c9a17b36b590
```

## Admin Panel Deployment

### Option 1: Vercel Separate App
Deploy admin panel as separate Vercel app with password protection.

### Option 2: Subdirectory
Deploy admin panel to `/admin` route on main app.

### Option 3: Separate Domain
Deploy admin panel on different subdomain.

## Recommended: Vercel Setup

**Why Vercel is best for you:**
1. Next.js native support
2. Serverless functions for API
3. Free SSL and CDN
4. Automatic deployments
5. Custom domain support
6. Excellent performance

**Migration Steps:**
1. Move backend routes to `pages/api/`
2. Update API calls in frontend
3. Deploy to Vercel
4. Test all functionality
5. Add custom domain if needed
