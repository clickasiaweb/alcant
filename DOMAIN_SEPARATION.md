# 🌐 Domain Separation Deployment Guide

## 📋 Architecture Overview

```
┌─────────────────┬─────────────────┐
│   Main Domain   │   API Subdomain   │
│                │                  │
│   Frontend     │   Backend/API      │
│   (Static)      │   (Node.js)       │
│                │                  │
│ your-domain.com │ api.your-domain.com │
└─────────────────┴─────────────────┘
```

## 🚀 Deployment Strategy

### Frontend (Main Domain)
- **Target**: `your-domain.com`
- **Type**: Static Next.js export
- **Content**: React SPA, images, CSS
- **Deployment**: Upload `frontend/out/` to `public_html/`

### Backend (API Subdomain)
- **Target**: `api.your-domain.com`
- **Type**: Node.js Express server
- **Content**: REST API, database operations
- **Deployment**: Deploy `backend/` to subdomain directory

## 📁 Project Structure

```
alcant/
├── frontend/
│   ├── out/              # Static build (→ main domain)
│   ├── components/        # React components
│   └── pages/           # Next.js pages
├── backend/
│   ├── controllers/       # API logic
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   └── server.js         # Node.js server (→ subdomain)
├── admin-panel/         # Admin interface (optional)
└── docs/               # Documentation
```

## 🔧 Configuration Files

### Frontend
- `frontend/next.config.js` - Static export config
- `frontend/.env.production` - Environment variables
- `frontend/out/` - Build output

### Backend
- `backend/.env.production` - Production environment
- `backend/server.js` - Express server
- CORS configured for main domain

## 🌍 DNS Configuration

### Required Records
```
A Record: your-domain.com → [Hostinger IP]
A Record: api.your-domain.com → [Hostinger IP]
CNAME: www.your-domain.com → your-domain.com
```

## 🔒 Security Setup

### SSL Certificates
- Main domain: Standard SSL certificate
- Subdomain: Wildcard or specific SSL for API
- HTTPS only: No HTTP endpoints

### CORS Configuration
```javascript
// Backend CORS
origin: ['https://your-domain.com']
credentials: true
methods: ['GET', 'POST', 'PUT', 'DELETE']
```

## 📊 Deployment Commands

### Frontend Deployment
```bash
cd frontend
npm run build
# Upload out/ folder to main domain public_html
```

### Backend Deployment
```bash
cd backend
npm install --production
# Deploy to api subdomain
npm start
```

## 🎯 Benefits

1. **Performance**: Static frontend loads instantly
2. **Scalability**: Backend can scale independently
3. **Security**: Separated concerns and CORS control
4. **Flexibility**: Different hosting options for each
5. **SEO**: Static files are SEO optimized

## 📋 Checklist

- [ ] Frontend builds to static files
- [ ] Backend runs on port 3000
- [ ] CORS configured for main domain
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] API endpoints accessible
- [ ] Frontend loads on main domain
- [ ] Admin panel accessible (optional)
