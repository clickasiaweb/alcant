# Vercel Deployment Guide for Alcant Platform

## Overview
This guide covers the deployment of the Alcant e-commerce platform across three Vercel deployments:
- **Frontend**: alcant12.vercel.app
- **Backend**: alcant-backend.vercel.app  
- **Admin Panel**: admin.alcant.in

## Deployment Architecture

### Backend API (alcant-backend.vercel.app)
- **Framework**: Node.js with Express
- **Database**: Supabase
- **Entry Point**: `backend/api/index.js`
- **Base URL**: `https://alcant-backend.vercel.app/api`

### Frontend (alcant12.vercel.app)
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **API URL**: `https://alcant-backend.vercel.app/api`

### Admin Panel (admin.alcant.in)
- **Framework**: React (Create React App)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **API URL**: `https://alcant-backend.vercel.app/api`

## Environment Variables

### Backend Environment Variables
```env
SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaGN4Z21qeWNoeGNycXF3Y3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjIwODQsImV4cCI6MjA4NDgzODA4NH0.lHKuN5EKkVmCMF-u3PKmDSXkkS2k8k52hQhZ2M5zdNg
NODE_ENV=production
```

### Frontend Environment Variables
```env
REACT_APP_SUPABASE_URL=https://orhcxgmjychxcrqqwcqu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaGN4Z21qeWNoeGNycXF3Y3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjIwODQsImV4cCI6MjA4NDgzODA4NH0.lHKuN5EKkVmCMF-u3PKmDSXkkS2k8k52hQhZ2M5zdNg
REACT_APP_API_URL=https://alcant-backend.vercel.app/api
```

### Admin Panel Environment Variables
```env
REACT_APP_API_URL=https://alcant-backend.vercel.app/api
```

## CORS Configuration
The backend is configured to accept requests from:
- https://alcant12.vercel.app
- https://alcant-backend.vercel.app
- https://admin.alcant.in
- Local development URLs (localhost:3000-3002)

## Public API Endpoints

### Products
- `GET /api/products` - All products
- `GET /api/products/recommended` - Recommended products
- `GET /api/products/featured` - Featured products
- `GET /api/products/new` - New products
- `GET /api/products/sale` - Sale products
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/category/:category` - Products by category
- `GET /api/products/slug/:slug` - Product by slug

### Categories
- `GET /api/categories` - All categories
- `GET /api/categories/hierarchy` - Category hierarchy
- `GET /api/categories/:slug` - Category by slug
- `GET /api/categories/:slug/products` - Category products

### Content
- `GET /api/content/:pageKey` - Page content

### Health
- `GET /api/health` - API health check

## Deployment Steps

### 1. Backend Deployment
1. Push backend code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy - Vercel will automatically detect `backend/vercel.json`
5. Verify deployment at `https://alcant-backend.vercel.app/api/health`

### 2. Frontend Deployment
1. Push frontend code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy - Vercel will detect Next.js framework
5. Verify deployment at `https://alcant12.vercel.app`

### 3. Admin Panel Deployment
1. Push admin-panel code to GitHub repository
2. Connect repository to Vercel
3. Set custom domain: `admin.alcant.in`
4. Set environment variables in Vercel dashboard
5. Deploy - Vercel will detect Create React App
6. Verify deployment at `https://admin.alcant.in`

## Domain Configuration

### Custom Domain Setup
1. In Vercel dashboard, add custom domains:
   - `alcant12.vercel.app` (frontend)
   - `admin.alcant.in` (admin panel)
2. Configure DNS records:
   - For `admin.alcant.in`: CNAME record pointing to `cname.vercel-dns.com`
3. Wait for SSL certificate provisioning

## Testing the Deployment

### 1. API Health Check
```bash
curl https://alcant-backend.vercel.app/api/health
```

### 2. Test Product API
```bash
curl https://alcant-backend.vercel.app/api/products
```

### 3. Test Frontend
Visit `https://alcant12.vercel.app` in browser

### 4. Test Admin Panel
Visit `https://admin.alcant.in` in browser

## Monitoring and Logs

### Vercel Dashboard
- Monitor deployment status
- View function logs
- Check performance metrics
- Set up alerts for errors

### Health Monitoring
- Use `/api/health` endpoint for uptime monitoring
- Monitor database connection status
- Set up external monitoring tools

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to repository
2. **CORS**: Only allow trusted domains
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **API Keys**: Regularly rotate Supabase keys
5. **HTTPS**: All deployments use HTTPS by default

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check allowed origins in backend CORS configuration
2. **Database Connection**: Verify Supabase credentials and network access
3. **Build Failures**: Check build logs and dependency versions
4. **Domain Issues**: Verify DNS configuration and SSL certificates

### Debug Commands
```bash
# Check API health
curl https://alcant-backend.vercel.app/api/health

# Test specific endpoint
curl https://alcant-backend.vercel.app/api/products?limit=1

# Check CORS headers
curl -H "Origin: https://alcant12.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://alcant-backend.vercel.app/api/products
```

## Performance Optimization

1. **Backend**: Enable caching for frequently accessed data
2. **Frontend**: Optimize images and use Next.js Image component
3. **Database**: Implement proper indexing in Supabase
4. **CDN**: Vercel provides automatic CDN distribution

## Backup and Recovery

1. **Database**: Regular Supabase backups
2. **Code**: Git version control
3. **Assets**: Store images in CDN or cloud storage
4. **Configuration**: Document all environment variables
