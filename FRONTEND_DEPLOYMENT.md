# Frontend-Only Deployment Configuration

## 🌐 Domain Structure

- **Main Domain**: `your-domain.com` → Frontend Only
- **API Subdomain**: `api.your-domain.com` → Backend/API

## 📦 Frontend Deployment

The frontend will be built as static files and deployed to the main domain.

### Build Configuration
```json
{
  "output": "export",
  "trailingSlash": false,
  "images": {
    "domains": ["your-domain.com"]
  }
}
```

### Deployment Files
- `frontend/out/` → Static build output
- `public/` → Hostinger public_html directory
- `.htaccess` → Static file serving

## 🔧 Backend Configuration

The backend will be deployed to a subdomain for API access.

### Environment Variables
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
```

### Subdomain Setup
- API URL: `https://api.your-domain.com`
- Frontend API calls: `/api/*` → `https://api.your-domain.com/*`

## 🚀 Deployment Process

### Frontend (Main Domain)
1. Build static files
2. Upload to public_html
3. Configure .htaccess for SPA routing

### Backend (Subdomain)
1. Deploy Node.js application
2. Configure subdomain DNS
3. Set up CORS for main domain

## 📋 Configuration Files

This setup allows:
- ✅ Static frontend on main domain
- ✅ API backend on subdomain
- ✅ Proper CORS configuration
- ✅ Independent scaling
- ✅ Separate deployment pipelines
