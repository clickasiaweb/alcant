# MongoDB Setup Guide for ALCANSIDE Website

## Prerequisites

1. **MongoDB Atlas Account** (recommended) or local MongoDB installation
2. **Node.js** installed on your system

## Step 1: Set up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is sufficient)
4. Create a database user:
   - Username: `alcanside_admin`
   - Password: Generate a strong password
5. Configure network access:
   - Add your current IP address (or `0.0.0.0/0` for all IPs - not recommended for production)
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string

## Step 2: Update Environment Variables

Edit the `.env` file in the `backend` folder:

```env
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://alcanside_admin:YOUR_PASSWORD@cluster.mongodb.net/alcanside

# JWT Secret (generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# API Port
PORT=5000

# CORS Origin
CORS_ORIGIN=http://localhost:3000

# Admin Panel URL
ADMIN_ORIGIN=http://localhost:3001
```

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Seed the Database

Run the seed script to populate your database with ALCANSIDE products:

```bash
npm run seed
```

Or run the specific seed script:

```bash
node scripts/seedAlcansideProducts.js
```

## Step 5: Start the Backend Server

```bash
npm run dev
```

The server should start on `http://localhost:5000`

## Step 6: Test the API Endpoints

Open your browser or use Postman to test:

1. **Get all products**: `http://localhost:5000/api/products`
2. **Get categories**: `http://localhost:5000/api/products/categories`
3. **Get phone cases**: `http://localhost:5000/api/products/category/phone-cases`
4. **Get featured products**: `http://localhost:5000/api/products/featured`

## Step 7: Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start on `http://localhost:3000`

## API Endpoints Available

### Products
- `GET /api/products` - Get all products (with pagination, filtering, sorting)
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new products
- `GET /api/products/sale` - Get sale products
- `GET /api/products/limited-edition` - Get limited edition products
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/categories` - Get categories with counts
- `GET /api/products/slug/:slug` - Get product by slug

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 24)
- `sort` - Sort by: featured, newest, price_asc, price_desc, rating
- `category` - Filter by category
- `subcategory` - Filter by subcategory
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter

## Troubleshooting

### Connection Issues
1. Check your MongoDB connection string in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify your database user credentials

### Server Issues
1. Check that all dependencies are installed
2. Verify the port 5000 is not in use
3. Check the console for error messages

### Frontend Issues
1. Ensure the backend is running on port 5000
2. Check CORS settings in the backend
3. Verify API calls in the browser console

## Production Deployment

For production:

1. Use environment variables for all sensitive data
2. Enable authentication on your MongoDB cluster
3. Use a proper domain and HTTPS
4. Set up proper CORS origins
5. Use a strong JWT secret
6. Enable MongoDB backups

## Database Schema

The Product model includes:
- `name` - Product name
- `slug` - URL-friendly identifier
- `description` - Product description
- `price` - Current price
- `oldPrice` - Original price (for discounts)
- `category` - Product category
- `subcategory` - Product subcategory
- `image` - Main product image
- `images` - Array of product images
- `rating` - Product rating (1-5)
- `reviews` - Number of reviews
- `stock` - Stock quantity
- `isNew` - New product flag
- `isLimitedEdition` - Limited edition flag
- `isBlueMondaySale` - Blue Monday sale flag
- `isActive` - Active status
- `createdAt` - Creation date
- `updatedAt` - Last update date
