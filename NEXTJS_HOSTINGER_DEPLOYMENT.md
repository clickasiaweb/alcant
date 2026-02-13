# Next.js Server-Side Deployment on Hostinger

## Important: Frontend is now configured for Server-Side Rendering

Your frontend will work exactly like localhost - as a full Next.js application with server-side rendering, not static files.

## Deployment Steps

### Step 1: GIT Deployment
1. Go to Hostinger → Websites → alcant.in → GIT
2. Repository URL: `https://github.com/clickasiaweb/alcant.git`
3. Branch: `main`
4. Directory: Leave empty
5. Click Deploy

### Step 2: Setup Frontend Environment
After GIT deployment, connect via SSH and setup the frontend:

```bash
# Navigate to frontend directory
cd public_html/frontend

# Copy production package.json
cp package.production.json package.json

# Install dependencies
npm install

# Set production environment
export NODE_ENV=production
export PORT=3000
```

### Step 3: Setup Backend Environment
```bash
# Navigate to backend directory
cd ../backend

# Copy production environment
cp .env.production .env

# Install dependencies
npm install
```

### Step 4: Start Both Applications

**Option A: Using PM2 (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Start frontend
cd public_html/frontend
pm2 start npm --name "frontend" -- start

# Start backend
cd ../backend
pm2 start npm --name "backend" -- start

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

**Option B: Using Cron Jobs**
1. Go to Hostinger → Cron Jobs
2. Create two cron jobs:

**Frontend Cron Job:**
```
Command: cd public_html/frontend && npm start
Schedule: Every minute
```

**Backend Cron Job:**
```
Command: cd public_html/backend && npm start
Schedule: Every minute
```

### Step 5: Configure .htaccess for Next.js
Create `.htaccess` in `public_html`:

```apache
RewriteEngine On

# Proxy frontend requests to Next.js server
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Proxy API requests to backend
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
```

### Step 6: Test Your Application
- **Frontend**: `https://alcant.in` (should work exactly like localhost)
- **API**: `https://alcant.in/api/products`
- **Admin Panel**: `https://alcant.in/admin`

## What's Different Now?

### Before (Static Export):
- Generated HTML files
- No server needed for frontend
- Limited functionality

### Now (Server-Side Rendering):
- Full Next.js server
- Dynamic routes work properly
- API routes work
- Server-side rendering
- Exactly like localhost experience

## File Structure After Deployment:
```
public_html/
├── frontend/
│   ├── .next/           (Next.js build files)
│   ├── node_modules/    (Dependencies)
│   ├── package.json     (Dependencies list)
│   └── server.js        (Next.js server)
├── backend/
│   ├── node_modules/    (Dependencies)
│   ├── server.js        (Express server)
│   └── .env            (Environment variables)
├── admin-panel/         (Admin panel files)
└── .htaccess           (Apache configuration)
```

## Troubleshooting

### Frontend Not Working:
1. Check if Next.js server is running: `pm2 status`
2. Check logs: `pm2 logs frontend`
3. Verify port 3000 is available
4. Check .htaccess configuration

### Backend Not Working:
1. Check if backend server is running: `pm2 status`
2. Check logs: `pm2 logs backend`
3. Verify environment variables
4. Check database connection

### Both Not Working:
1. Check Node.js version: `node --v` (should be >= 18)
2. Check if ports 3000 and 3001 are available
3. Restart services: `pm2 restart all`

## Port Configuration
- Frontend (Next.js): Port 3000
- Backend (Express): Port 3001
- Make sure both ports are open in Hostinger firewall

## Environment Variables Needed
For frontend (in `frontend/.env`):
```
NODE_ENV=production
PORT=3000
```

For backend (in `backend/.env`):
```
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=93342746-fd5c-4320-b777-c9a17b36b590
CORS_ORIGIN=https://alcant.in
```

Now your application will work exactly like it does on localhost!
