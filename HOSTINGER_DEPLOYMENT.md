# Hostinger Deployment Configuration

## Node.js Application Setup

This is a Node.js full-stack application, not a PHP project.

### Project Structure
- `frontend/` - Next.js React application
- `backend/` - Node.js Express API
- `admin-panel/` - React admin interface

### Deployment Requirements

1. **Node.js Version**: >= 18.0.0
2. **NPM Version**: >= 8.0.0
3. **Build Process**: 
   - Install dependencies in all directories
   - Build frontend and admin-panel
   - Start backend server

### Environment Variables Required

Backend (.env):
```
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Frontend (.env.production):
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Commands

```bash
# Install all dependencies
npm run install-deps

# Build applications
npm run build

# Start production server
npm start
```

### Web Server Configuration

- **Document Root**: Project root directory
- **Node.js Startup File**: `backend/server.js`
- **Port**: 3000 (or as configured)
- **Environment**: Production
