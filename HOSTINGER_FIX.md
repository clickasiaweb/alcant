# HOSTINGER DEPLOYMENT INSTRUCTIONS

## ⚠️ IMPORTANT: Hostinger PHP Detection Issue

Hostinger's auto-deployment is still looking for PHP files. Here are the solutions:

### Solution 1: Manual Node.js Setup (Recommended)

1. **In Hostinger Control Panel:**
   - Go to Hosting → Manage → Advanced → Node.js
   - Select "Create New Node.js Application"
   - Set Document Root to your project directory
   - Node.js Version: 18.x
   - Startup File: `server.js`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   ```

3. **Manual Commands:**
   ```bash
   cd /path/to/your/project
   npm install
   npm run build
   npm start
   ```

### Solution 2: Use Vercel/Netlify (Alternative)

Deploy to Vercel (better for Next.js):
```bash
npm install -g vercel
vercel --prod
```

### Solution 3: Contact Hostinger Support

Request they enable Node.js auto-detection for your domain:
- Domain: [your-domain.com]
- Repository: git@github.com:clickasiaweb/alcant.git
- Issue: PHP detection despite Node.js configuration

### Files Created for Node.js Detection

- ✅ `package.json` - Node.js project file
- ✅ `package-lock.json` - Dependencies lock file
- ✅ `server.js` - Node.js entry point
- ✅ `.htaccess` - Apache configuration
- ✅ `deployment.ini` - Deployment manifest
- ✅ `hostinger-deployment.json` - JSON configuration

### Quick Test

Run locally to verify:
```bash
npm install
npm run build
npm start
```

The application should run on http://localhost:3000
