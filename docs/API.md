# Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All admin endpoints require JWT token in header:

```
Authorization: Bearer {token}
```

## Endpoints

### Products

#### Get Products

```
GET /products
Query Parameters:
  - category (optional): Category ID
  - search (optional): Search term
  - page (optional): Page number (default: 1)
  - limit (optional): Items per page (default: 12)

Response:
{
  "data": [...],
  "pagination": {
    "total": 24,
    "pages": 2,
    "currentPage": 1
  }
}
```

#### Get Product by Slug

```
GET /products/{slug}

Response:
{
  "_id": "...",
  "name": "Product Name",
  "slug": "product-name",
  "description": "...",
  "specifications": {...},
  "images": [...],
  ...
}
```

#### Create Product (Admin)

```
POST /products
Headers: Authorization: Bearer {token}

Body:
{
  "name": "Product Name",
  "category": "category-id",
  "description": "Long description",
  "shortDescription": "Short description",
  "specifications": {
    "Dimension": "100x100x100mm",
    "Weight": "5kg"
  },
  "applications": ["Application 1", "Application 2"],
  "images": [
    {
      "url": "image-url",
      "altText": "Image description",
      "isPrimary": true
    }
  ],
  "datasheetUrl": "pdf-url",
  "seoMetaTitle": "SEO Title",
  "seoMetaDescription": "SEO Description"
}
```

#### Update Product (Admin)

```
PUT /products/{id}
Headers: Authorization: Bearer {token}

Body: {same as create}
```

#### Delete Product (Admin)

```
DELETE /products/{id}
Headers: Authorization: Bearer {token}
```

### Categories

#### Get All Categories

```
GET /categories

Response: [
  {
    "_id": "...",
    "name": "Category Name",
    "slug": "category-name",
    "description": "...",
    "icon": "icon-url",
    "displayOrder": 1
  }
]
```

#### Get Category by Slug

```
GET /categories/{slug}
```

#### Create Category (Admin)

```
POST /categories
Headers: Authorization: Bearer {token}

Body:
{
  "name": "Category Name",
  "description": "Description",
  "icon": "icon-url",
  "image": "image-url",
  "displayOrder": 1
}
```

#### Update/Delete Category

```
PUT /categories/{id}
DELETE /categories/{id}
Headers: Authorization: Bearer {token}
```

### Authentication

#### Login

```
POST /auth/login

Body:
{
  "email": "admin@example.com",
  "password": "password"
}

Response:
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Register

```
POST /auth/register

Body:
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password"
}
```

#### Get Current User

```
GET /auth/me
Headers: Authorization: Bearer {token}
```

### Inquiries

#### Submit Inquiry

```
POST /inquiries

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "subject": "Product Inquiry",
  "message": "I'm interested in...",
  "productId": "product-id" (optional)
}
```

#### Get Inquiries (Admin)

```
GET /inquiries
Headers: Authorization: Bearer {token}
Query Parameters:
  - status (optional): new|read|responded|closed
  - page (optional): Page number
  - limit (optional): Items per page
```

#### Update Inquiry (Admin)

```
PUT /inquiries/{id}
Headers: Authorization: Bearer {token}

Body:
{
  "status": "responded",
  "response": "Thank you for your inquiry..."
}
```

#### Delete Inquiry (Admin)

```
DELETE /inquiries/{id}
Headers: Authorization: Bearer {token}
```

### Content

#### Get Content

```
GET /content/{pageKey}

Response:
{
  "_id": "...",
  "pageKey": "home",
  "title": "Home",
  "content": "...",
  "sections": [
    {
      "name": "hero",
      "content": "...",
      "order": 1
    }
  ]
}
```

#### Update Content (Admin)

```
PUT /content/{pageKey}
Headers: Authorization: Bearer {token}

Body:
{
  "title": "Page Title",
  "content": "Page content",
  "sections": [...],
  "bannerImage": "image-url"
}
```

## Error Responses

```
400: Bad Request
{
  "error": "Error message"
}

401: Unauthorized
{
  "error": "No authentication token provided"
}

403: Forbidden
{
  "error": "Admin access required"
}

404: Not Found
{
  "error": "Resource not found"
}

500: Internal Server Error
{
  "error": "Internal server error"
}
```

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
