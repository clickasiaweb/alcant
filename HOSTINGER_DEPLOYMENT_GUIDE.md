# Hostinger Deployment Guide

## Prerequisites
- Your Git repository is now ready with the latest changes
- Hostinger hosting account with SSH and GIT access enabled
- Your domain: `alcant.in`

## Option 1: GIT Deployment (Recommended)

### Step 1: Access Hostinger GIT Deployment
1. Log in to your Hostinger control panel
2. Go to Websites → alcant.in → GIT
3. Click on "Create a New Repository"

### Step 2: Configure GIT Repository
- **Repository URL**: `https://github.com/clickasiaweb/alcant.git`
- **Branch**: `main`
- **Directory**: Leave empty (will deploy to `public_html`)
- Click "Deploy"

### Step 3: Configure Environment Variables
In Hostinger control panel:
1. Go to Websites → alcant.in → Hosting → Manage
2. Set up environment variables in `.env` file or through hosting panel:
   ```
   NODE_ENV=production
   PORT=3000
   SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=93342746-fd5c-4320-b777-c9a17b36b590
   CORS_ORIGIN=https://alcant.in
   ```

### Step 4: Setup Backend Process
1. Go to Websites → alcant.in → Hosting → Manage → Cron Jobs
2. Create a cron job to keep the backend running:
   ```
   Command: cd public_html/backend && npm start
   Schedule: Every minute
   ```

## Option 2: SSH Deployment

### Step 1: Connect via SSH
Using your SSH details:
- IP: `145.223.17.74`
- Port: `65002`
- Username: `u852602474`

```bash
ssh u852602474@145.223.17.74 -p 65002
```

### Step 2: Navigate to Public Directory
```bash
cd public_html
```

### Step 3: Clone Repository
```bash
git clone https://github.com/clickasiaweb/alcant.git .
```

### Step 4: Setup Environment
```bash
cp backend/.env.production backend/.env
cd backend && npm install
```

### Step 5: Start Backend
```bash
npm start
```

### Step 6: Setup Process Manager
Install PM2 to keep the backend running:
```bash
npm install -g pm2
pm2 start server.js --name "alcant-backend"
pm2 startup
pm2 save
```

## File Structure After Deployment
```
public_html/
├── index.html (from frontend/out)
├── about.html
├── products.html
├── _next/ (Next.js assets)
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/
└── admin-panel/
    ├── build/
    └── static/
```

## Post-Deployment Configuration

### 1. Update Frontend API URLs
Make sure frontend API calls point to your domain:
```javascript
// In frontend/lib/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://alcant.in/api' 
  : 'http://localhost:5000/api';
```

### 2. Test the Application
1. Visit `https://alcant.in` - Frontend should load
2. Test API endpoints: `https://alcant.in/api/products`
3. Test admin panel: `https://alcant.in/admin`

### 3. SSL Certificate
Hostinger usually provides free SSL. Ensure HTTPS is working.

## Troubleshooting

### Backend Not Starting
- Check Node.js version: `node --v` (should be >= 18)
- Check logs: `pm2 logs alcant-backend`
- Verify environment variables

### Frontend Not Loading
- Check if files exist in `public_html`
- Verify `.htaccess` configuration
- Check browser console for errors

### API Calls Failing
- Verify CORS settings
- Check if backend is running on correct port
- Check firewall settings

## Monitoring
- Use Hostinger's monitoring tools
- Check error logs in hosting panel
- Monitor PM2 processes if using SSH deployment

## Next Steps
1. Set up automated backups
2. Configure CDN if needed
3. Set up monitoring alerts
4. Regular security updates
