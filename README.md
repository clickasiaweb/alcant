# Industrial Solutions - Complete Website & Admin Platform

A professional, copyright-free industrial products website with a comprehensive admin panel for dynamic product management.

## 📋 Project Structure

```
industrial-solutions/
├── frontend/              # Next.js public website
├── backend/               # Express.js API server
├── admin-panel/           # React admin dashboard
└── docs/                  # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Update environment variables in `.env`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3001
```

4. Start backend server:

```bash
npm run dev
```

Backend will be running at: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
npm install
```

2. Start development server:

```bash
npm run dev
```

Frontend will be running at: `http://localhost:3000`

### Admin Panel Setup

1. Navigate to admin-panel directory:

```bash
cd admin-panel
npm install
```

2. Start admin panel:

```bash
npm start
```

Admin panel will be running at: `http://localhost:3000`

## 📚 API Endpoints

### Products

- `GET /api/products` - Get all products with filters
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Authentication

- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login admin user
- `GET /api/auth/me` - Get current user (Protected)

### Inquiries

- `POST /api/inquiries` - Submit contact inquiry
- `GET /api/inquiries` - Get all inquiries (Admin)
- `PUT /api/inquiries/:id` - Update inquiry (Admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (Admin)

### Content

- `GET /api/content/:pageKey` - Get content for page
- `PUT /api/content/:pageKey` - Update page content (Admin)

## 🎨 Frontend Features

### Pages

- **Home** - Hero section with features and CTA
- **Products** - Grid with filters, search, and pagination
- **Product Detail** - Full product info, specs, images, datasheet
- **Contact** - Contact form, business info, maps
- **About** - Company information

### Design

- Responsive (Mobile, Tablet, Desktop)
- Tailwind CSS styling
- Clean, professional layout
- Fast performance (<2.5s load time)
- SEO optimized

## 🔧 Admin Panel Features

### Dashboard

- Product count
- Category count
- Recent inquiries
- Quick action buttons

### Product Management

- Create/Edit/Delete products
- Upload multiple images
- Add technical specifications
- Manage datasheets
- SEO metadata

### Category Management

- Create/Edit/Delete categories
- Assign display order
- Add category images/icons

### Inquiry Management

- View all contact inquiries
- Filter by status (New/Read/Responded)
- Mark inquiries as responded
- Delete inquiries

### Content Management

- Edit static page content
- Update banner images
- Manage CTA text

## 🗄️ Database Models

### Product

```javascript
{
  name: String,
  slug: String,
  category: ObjectId,
  description: String,
  shortDescription: String,
  specifications: Map,
  applications: [String],
  images: [{url, altText, isPrimary}],
  datasheetUrl: String,
  price: Number,
  seoMetaTitle: String,
  seoMetaDescription: String,
  seoKeywords: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Category

```javascript
{
  name: String,
  slug: String,
  description: String,
  icon: String,
  image: String,
  seoMetaTitle: String,
  seoMetaDescription: String,
  displayOrder: Number,
  isActive: Boolean
}
```

### Inquiry

```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  subject: String,
  message: String,
  productId: ObjectId,
  status: String (new|read|responded|closed),
  response: String,
  respondedBy: ObjectId,
  respondedAt: Date,
  createdAt: Date
}
```

### User

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String (admin|editor),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS enabled
- Middleware validation
- Protected admin routes
- Environment variables for sensitive data

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Performance Optimization

- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Minification

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

### Backend (AWS/DigitalOcean)

1. Create server instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Set up environment variables
6. Start process with PM2
7. Configure reverse proxy (Nginx)

### Database (MongoDB Atlas)

1. Create cluster
2. Add IP whitelist
3. Create database user
4. Get connection string
5. Update backend `.env`

## 📝 Admin User Setup

First admin user must be created via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@industrialsolutions.com",
    "password": "SecurePassword123"
  }'
```

## 🔄 Workflow

1. **Admin** creates products, categories, and content in admin panel
2. **Data** is stored in MongoDB
3. **Frontend** fetches data from API
4. **Users** browse website and submit inquiries
5. **Admins** manage inquiries and respond

## 🌐 SEO Features

- Meta titles and descriptions
- Semantic HTML
- Sitemap support
- Robots.txt
- Structured data
- Mobile-friendly
- Fast loading

## 📧 Contact & Support

For product information:

- Email: info@industrialsolutions.com
- Phone: +1 (555) 123-4567

## 📄 License

Copyright © 2024 Industrial Solutions. All rights reserved.

---

**Note:** This is a copyright-free original design and implementation. Content should be customized with your company information and unique branding.
