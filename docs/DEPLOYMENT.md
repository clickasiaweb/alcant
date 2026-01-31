# Deployment Guide

## Environments

- **Development**: Local machine (http://localhost:3000)
- **Staging**: Pre-production testing
- **Production**: Live environment

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificates ready
- [ ] Security headers configured
- [ ] CORS settings verified
- [ ] Rate limiting enabled
- [ ] Logging setup complete

## Backend Deployment (AWS EC2)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB client
sudo apt install -y mongodb-org-shell

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Deploy Application

```bash
# Clone repository
git clone <repo-url> /home/ubuntu/app
cd /home/ubuntu/app/backend

# Install dependencies
npm install --production

# Create .env file
nano .env

# Start with PM2
pm2 start server.js --name "industrial-api"
pm2 startup
pm2 save
```

### 3. Setup Nginx Reverse Proxy

```bash
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/industrial-api

# Add configuration:
server {
    listen 80;
    server_name api.industrialsolutions.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/industrial-api /etc/nginx/sites-enabled/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d api.industrialsolutions.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Frontend Deployment (Vercel)

### 1. Connect Repository

- Push code to GitHub
- Go to Vercel.com
- Import GitHub repository
- Select `frontend` directory as root

### 2. Configure Build

```
Build Command: npm run build
Output Directory: .next
```

### 3. Environment Variables

- Add `NEXT_PUBLIC_API_URL=https://api.industrialsolutions.com/api`

### 4. Deploy

- Vercel automatically deploys on git push

## Admin Panel Deployment (Vercel/Netlify)

### Build & Deploy

```bash
cd admin-panel
npm run build

# Deploy to Vercel
vercel --prod
```

## Database Setup (MongoDB Atlas)

### 1. Create Cluster

- Go to MongoDB Atlas
- Create new cluster
- Select appropriate region

### 2. Create Database User

- Navigate to Security > Database Access
- Create new user with strong password
- Assign appropriate roles

### 3. Add IP Whitelist

- Go to Network Access
- Add your server IP
- Or allow 0.0.0.0/0 (less secure)

### 4. Get Connection String

- Cluster > Connect > Connect your application
- Copy connection string
- Update `MONGODB_URI` in backend `.env`

## Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs industrial-api

# Monitor processes
pm2 monit

# Setup monitoring
pm2 web  # Accessible at :9615
```

### Nginx Access & Error Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Database Backup

```bash
# Automated daily backup with MongoDB Atlas
# Or manual backup:
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore:
mongorestore ./backup
```

### Code Backup

- GitHub repository serves as backup
- Tag releases: `git tag -a v1.0.0`

## Performance Optimization

### Frontend

- Enable Next.js Image Optimization
- Use CDN for static assets
- Enable compression in Nginx

### Backend

- Enable Redis caching
- Use connection pooling for MongoDB
- Implement rate limiting

### Database

- Create indexes on frequently queried fields
- Archive old inquiries
- Regular maintenance

## Security Hardening

### Environment Variables

```bash
# Never commit .env files
echo ".env" >> .gitignore
```

### SSL/TLS

- Force HTTPS redirect
- Configure HSTS headers
- Use strong ciphers

### API Security

```javascript
// In Express middleware
const helmet = require("helmet");
app.use(helmet());

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
```

### Database Security

- Enable authentication
- Use IP whitelist
- Enable encryption
- Regular backups

## Rollback Procedure

### Code Rollback

```bash
git revert <commit-hash>
git push origin main
# Vercel auto-deploys

# Or with PM2:
pm2 stop industrial-api
cd /home/ubuntu/app/backend
git checkout <previous-version>
npm install
pm2 start server.js
```

### Database Rollback

```bash
# Restore from backup
mongorestore --drop ./backup
```

## Monitoring Alerts

### Uptime Monitoring

- Use UptimeRobot or similar
- Monitor all three services
- Configure alert emails

### Performance Monitoring

- NewRelic or DataDog
- Monitor response times
- Track error rates
- Monitor resource usage

## Support & Maintenance

### Regular Tasks

- Review logs weekly
- Check security updates
- Monitor performance metrics
- Update dependencies monthly

### Emergency Contacts

- DevOps Team
- Database Admin
- Security Team
- Project Manager
