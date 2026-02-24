# 🌐 Custom Domain Deployment Guide - alcannt.in

## 🎯 **Your Domain Setup:**
```
🌐 Main Site:    https://alcannt.in
🔧 Backend API:   https://api.alcannt.in  
🎛️ Admin Panel:  https://admin.alcannt.in
💰 Cost:         $0/month (Vercel free tier)
```

---

## 📋 **Configuration Files Updated:**

### ✅ **Frontend** (`frontend/.env.production`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://db.orhcxgmjychxcrqqwcqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_API_URL=https://api.alcannt.in
NODE_ENV=production
```

### ✅ **Backend** (`backend/vercel.json`)
```json
{
  "version": 2,
  "name": "alcant-backend",
  "builds": [{"src": "api/index.js", "use": "@vercel/node"}],
  "routes": [{"src": "/api/(.*)", "dest": "/api/index.js"}],
  "env": {
    "SUPABASE_URL": "https://db.orhcxgmjychxcrqqwcqu.supabase.co",
    "SUPABASE_ANON_KEY": "your-key",
    "NODE_ENV": "production"
  }
}
```

### ✅ **Admin Panel** (`admin-panel/.env.production`)
```env
REACT_APP_API_URL=https://api.alcannt.in
NODE_ENV=production
```

---

## 🚀 **Deployment Steps:**

### **Step 1: Deploy Backend**
```bash
cd backend
git init
git add .
git commit -m "Backend for alcannt.in"
git remote add origin https://github.com/YOUR_USERNAME/alcant-backend.git
git push -u origin main
```

**Vercel Deployment:**
1. New Project → Import `alcant-backend`
2. Framework: Other (Node.js)
3. Add domain: `api.alcannt.in`
4. Deploy

### **Step 2: Deploy Admin Panel**
```bash
cd ../admin-panel
git init
git add .
git commit -m "Admin panel for alcannt.in"
git remote add origin https://github.com/YOUR_USERNAME/alcant-admin.git
git push -u origin main
```

**Vercel Deployment:**
1. New Project → Import `alcant-admin`
2. Framework: Create React App
3. Add domain: `admin.alcannt.in`
4. Deploy

### **Step 3: Point Frontend to Custom Domain**
1. Go to Vercel dashboard → `alcant12` project
2. Settings → Domains
3. Add domain: `alcannt.in`
4. Vercel provides DNS records
5. Update your domain DNS with Vercel's records

---

## 🔧 **DNS Configuration for alcannt.in**

### **Option A: A Records (Recommended)**
```
Type: A Record
Name: @ (or alcannt.in)
Value: 76.76.19.19 (Vercel's IP)
TTL: 300

Type: A Record  
Name: api
Value: 76.76.19.19
TTL: 300

Type: A Record
Name: admin
Value: 76.76.19.19  
TTL: 300

Type: CNAME
Name: www
Value: alcannt.in
TTL: 300
```

### **Option B: Vercel Nameservers (Easier)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

---

## 🧪 **Testing After Deployment:**

### **Test Backend API:**
```bash
curl https://api.alcannt.in/api/health
curl https://api.alcannt.in/api/categories/hierarchy
```

### **Test Admin Panel:**
- Visit `https://admin.alcannt.in`
- Login with admin credentials
- Check if categories load from API

### **Test Frontend:**
- Visit `https://alcannt.in`
- Header should show real categories
- No more mock data fallback

---

## 🎯 **Final URLs:**

```
✅ Frontend: https://alcannt.in (from alcant12.vercel.app)
🚀 Backend:  https://api.alcannt.in (Vercel custom domain)
🚀 Admin:   https://admin.alcannt.in (Vercel custom domain)
```

---

## 💡 **Benefits of Custom Domain Setup:**

### **1. Professional Branding**
- Consistent brand across all services
- Easy to remember URLs
- Professional email addresses (contact@alcannt.in)

### **2. SEO Advantages**
- Subdomains help with site structure
- Better search engine indexing
- Clear service separation

### **3. Technical Benefits**
- SSL certificates (free from Vercel)
- Global CDN (free from Vercel)
- Independent scaling per service

---

## 🆘 **Troubleshooting:**

### **Domain Not Pointing:**
- Wait 24-48 hours for DNS propagation
- Use `dig alcannt.in` to verify DNS
- Check domain registrar DNS settings

### **CORS Issues:**
- Backend CORS already configured for alcannt.in
- Check browser console for specific errors
- Verify all subdomains in allowed origins

### **Build Failures:**
- Check Vercel build logs
- Test builds locally first
- Verify all dependencies installed

---

## 🎉 **Success Criteria:**

✅ **Backend**: `https://api.alcannt.in/api/health` responding  
✅ **Admin**: `https://admin.alcannt.in` functional  
✅ **Frontend**: `https://alcannt.in` using real API  
✅ **CORS**: All services communicating  
✅ **Cost**: $0/month  
✅ **SSL**: Free certificates active  
✅ **CDN**: Global performance active  

---

## 🚀 **You're Ready!**

Your complete application will be live on your custom domain:
- 🏢 **Professional web presence**
- 🔧 **Robust API** 
- 🎛️ **Admin interface**
- 💰 **Zero monthly costs**
- 🌍 **Global performance**

Deploy now and enjoy your full-stack application on alcannt.in! 🎉
