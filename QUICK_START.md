# Quick Start Guide

Get your Industrial Solutions platform running in 5 minutes!

## 🚀 Start Backend

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your settings:
# - MONGODB_URI: MongoDB connection string
# - JWT_SECRET: Random secret key

npm run dev
```

Backend runs at: **http://localhost:5000/api**

---

## 🎨 Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Website runs at: **http://localhost:3000**

---

## 🔐 Start Admin Panel

```bash
cd admin-panel
npm install
npm start
```

Admin runs at: **http://localhost:3001**

---

## 📝 Create First Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@industrialsolutions.com",
    "password": "SecurePassword123"
  }'
```

Then login in admin panel with these credentials.

---

## ✨ Add Your First Product

1. Login to admin panel: http://localhost:3001
2. Go to Products section
3. Click "Add New Product"
4. Fill in:
   - Product Name
   - Category ID (create category first)
   - Description
   - Specifications
   - Applications
5. Click Create Product
6. Check website: http://localhost:3000/products

---

## 🌍 Environment Setup

### Backend (.env)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/industrial
JWT_SECRET=your_random_secret_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3001
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Admin Panel (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 Key URLs

| Service      | URL                              | Purpose        |
| ------------ | -------------------------------- | -------------- |
| Frontend     | http://localhost:3000            | Public website |
| Admin        | http://localhost:3001            | Admin panel    |
| API          | http://localhost:5000/api        | Backend API    |
| Health Check | http://localhost:5000/api/health | API status     |

---

## 📚 Documentation

- **Full Setup**: See [README.md](./README.md)
- **API Reference**: See [docs/API.md](./docs/API.md)
- **Deployment**: See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Implementation Details**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection string
- Ensure .env file exists
- Check port 5000 is available

### Frontend won't load

- Check backend is running
- Clear .next folder: `rm -rf .next`
- Check Node.js version (v16+)

### Admin panel login fails

- Ensure admin user is created (see above)
- Check JWT_SECRET is same in backend
- Verify backend is running

### Products not showing

- Check category ID is valid
- Ensure product has isActive: true
- Check MongoDB connection

---

## 💡 Next Steps

1. **Customize Content**: Edit pages to add company info
2. **Add Categories**: Create product categories in admin
3. **Upload Products**: Add your products with images
4. **Configure Email**: Setup email for inquiries (optional)
5. **Deploy**: Follow [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📞 Support Resources

### For Each Service:

**Backend Issues**:

- Check `/backend/server.js` for startup
- Review routes in `/backend/routes/`
- Check models in `/backend/models/`

**Frontend Issues**:

- Check `/frontend/pages/` structure
- Review components in `/frontend/components/`
- Check `.env.local` configuration

**Admin Panel Issues**:

- Review `/admin-panel/src/pages/`
- Check authentication flow
- Verify API connection

---

## ✅ Quick Checklist

- [ ] MongoDB database created
- [ ] Backend .env configured
- [ ] Frontend .env.local configured
- [ ] Backend running on :5000
- [ ] Frontend running on :3000
- [ ] Admin panel running on :3001
- [ ] First admin user created
- [ ] Can login to admin panel
- [ ] Can view products page
- [ ] Can submit contact form

---

## 🎉 Success!

If all services are running and you can:

1. Login to admin panel
2. View products on website
3. Submit contact form

**Your platform is ready!**

---

For detailed documentation, start with [README.md](./README.md)
