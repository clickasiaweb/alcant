# ✅ Hostinger Setup Checklist

## Pre-Deployment Checklist

### Domain Configuration
- [ ] Main domain pointing to Hostinger nameservers
- [ ] SSL certificate installed for main domain
- [ ] Subdomains created: `admin.example.com`, `api.example.com`

### Hosting Plan
- [ ] Node.js hosting plan active
- [ ] SSH access enabled
- [ ] Sufficient storage for all modules

### Repository Setup
- [ ] Backend repository cloned via SSH
- [ ] Frontend build process tested locally
- [ ] Admin panel build process tested locally

## Backend Deployment

### Environment Setup
- [ ] `.env` file created with production values
- [ ] `DATABASE_URL` configured correctly
- [ ] `JWT_SECRET` generated and set
- [ ] Supabase credentials configured
- [ ] Cloudinary credentials configured

### PM2 Configuration
- [ ] PM2 installed globally
- [ ] `ecosystem.config.js` uploaded
- [ ] Application started with PM2
- [ ] PM2 startup script enabled
- [ ] Process auto-restart tested

### Hostinger hPanel Configuration
- [ ] Node.js version set to 18
- [ ] App root: `/home/username/backend`
- [ ] Startup file: `server.js`
- [ ] App URL: `api.example.com`
- [ ] Custom startup command (if needed)

## Frontend Deployment

### Build Configuration
- [ ] `next.config.js` configured for static export
- [ ] `output: 'export'` enabled
- [ ] `trailingSlash: true` set
- [ ] Images unoptimized for static hosting
- [ ] Build process tested: `npm run build`

### Environment Variables
- [ ] `.env.production` created
- [ ] `NEXT_PUBLIC_API_URL=https://api.example.com`
- [ ] All API endpoints using environment variable

### Upload Process
- [ ] Build files uploaded to `/public_html/`
- [ ] `index.html` present in root
- [ ] Static assets (CSS, JS, images) uploaded
- [ ] `_next` directory uploaded (if present)

## Admin Panel Deployment

### Build Configuration
- [ ] React app builds successfully
- [ ] Environment variables configured
- [ ] API endpoints using `REACT_APP_API_URL`

### Upload Process
- [ ] Build files uploaded to `/public_html/admin/`
- [ ] `index.html` present in admin directory
- [ ] Static assets uploaded correctly
- [ ] Subdomain pointing to admin directory

## Security & Performance

### CORS Configuration
- [ ] Backend allows `https://example.com`
- [ ] Backend allows `https://admin.example.com`
- [ ] Development URLs removed from production CORS

### Environment Security
- [ ] No secrets in code repositories
- [ ] `.env` files in `.gitignore`
- [ ] Production secrets only on server
- [ ] API keys secured

### SSL & HTTPS
- [ ] All domains using HTTPS
- [ ] No mixed content warnings
- [ ] API calls using HTTPS only

## Testing Checklist

### Backend Testing
- [ ] Health endpoint accessible: `https://api.example.com/api/health`
- [ ] Database connection working
- [ ] API endpoints responding correctly
- [ ] Error handling functional

### Frontend Testing
- [ ] Main site loads at `https://example.com`
- [ ] API calls working to backend
- [ ] All pages loading correctly
- [ ] No console errors

### Admin Panel Testing
- [ ] Admin panel loads at `https://admin.example.com`
- [ ] Authentication working
- [ ] CRUD operations functional
- [ ] File uploads working

## Monitoring & Maintenance

### Process Monitoring
- [ ] PM2 status checked
- [ ] Log rotation configured
- [ ] Error monitoring setup
- [ ] Uptime monitoring configured

### Backup Strategy
- [ ] Database backups configured
- [ ] File backups scheduled
- [ ] Recovery plan documented

### Update Process
- [ ] Git pull process tested
- [ ] Build processes documented
- [ ] Deployment scripts ready
- [ ] Rollback plan prepared

## Final Verification

### URL Testing
- [ ] `https://example.com` → Frontend loads
- [ ] `https://admin.example.com` → Admin panel loads  
- [ ] `https://api.example.com/api/health` → Backend responds

### Functionality Testing
- [ ] User can browse products
- [ ] Admin can manage content
- [ ] API calls working between modules
- [ ] Forms and submissions working

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] No memory leaks in backend
- [ ] Static assets cached properly
