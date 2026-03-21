# Alcant Public API Documentation

## Base URL
```
https://alcant-backend.vercel.app/api
```

## Available Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/recommended` - Get recommended products
- `GET /products/featured` - Get featured products
- `GET /products/new` - Get new products
- `GET /products/sale` - Get sale products
- `GET /products/limited-edition` - Get limited edition products
- `GET /products/categories` - Get product categories
- `GET /products/search?q=query` - Search products
- `GET /products/category/:category` - Get products by category
- `GET /products/slug/:slug` - Get product by slug

### Categories
- `GET /categories` - Get all categories
- `GET /categories/hierarchy` - Get categories with hierarchy
- `GET /categories/:slug` - Get category by slug
- `GET /categories/:slug/products` - Get products in category
- `GET /categories/:slug/subcategories` - Get subcategories
- `GET /categories/:slug/subcategories/:subcategorySlug/sub-subcategories` - Get sub-subcategories
- `GET /categories/iphone/hierarchy` - Get iPhone category hierarchy
- `GET /categories/all/with-subcategories` - Get all categories with subcategories

### Content
- `GET /content/:pageKey` - Get content by page key

### Health Check
- `GET /health` - API health status

## Response Format

All responses follow this format:
```json
{
  "data": [...],
  "success": true,
  "message": "Success"
}
```

Error responses:
```json
{
  "error": "Error message",
  "success": false
}
```

## CORS
The API supports CORS for the following domains:
- https://alcant12.vercel.app
- https://alcant-backend.vercel.app
- https://admin.alcant.in
- http://localhost:3000
- http://localhost:3001
- http://localhost:3002

## Rate Limiting
Currently no rate limiting is implemented, but it's recommended for production use.

## Authentication
Public endpoints do not require authentication. Admin endpoints are protected and require valid JWT tokens.

## Examples

### Get All Products
```javascript
fetch('https://alcant-backend.vercel.app/api/products')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Products by Category
```javascript
fetch('https://alcant-backend.vercel.app/api/products/category/electronics')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Search Products
```javascript
fetch('https://alcant-backend.vercel.app/api/products/search?q=iphone')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Deployment
The API is deployed on Vercel and uses serverless functions. Environment variables are configured in the Vercel dashboard.
