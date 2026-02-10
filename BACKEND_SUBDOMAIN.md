# Backend Subdomain Deployment Configuration

## 🌐 API Subdomain Setup

Backend will be deployed to: `api.your-domain.com`

## 🔧 Environment Configuration

### Production Environment (.env.production)
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
DATABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🚀 Deployment Process

### Subdomain Configuration
1. **DNS Setup**: Create A record for `api.your-domain.com`
2. **Hostinger Setup**: Configure subdomain for Node.js
3. **SSL Certificate**: Ensure HTTPS is enabled
4. **Firewall**: Open port 3000 or use reverse proxy

### Hostinger Subdomain Steps
1. In Hostinger Panel → Subdomains
2. Create `api` subdomain
3. Point to backend directory
4. Install SSL certificate

## 📋 API Endpoints

Frontend will call:
```
https://api.your-domain.com/api/categories
https://api.your-domain.com/api/products
https://api.your-domain.com/api/content
```

## 🔒 Security Considerations

- **Rate Limiting**: Implement API rate limits
- **Authentication**: JWT tokens for secure access
- **HTTPS Only**: No HTTP endpoints
- **CORS**: Restricted to main domain only

## 📊 Monitoring

- **Logs**: Track API requests and errors
- **Performance**: Monitor response times
- **Uptime**: Ensure API availability
- **Analytics**: Track usage patterns
