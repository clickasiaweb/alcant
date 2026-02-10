# iPhone Categories Database Setup

This document explains how to set up the hierarchical category structure for iPhone cases based on the navigation menu design.

## Overview

The iPhone categories system uses a three-level hierarchy:
- **Level 1**: Main Category (iPhone Cases)
- **Level 2**: Subcategories (iPhone 17, iPhone 16, iPhone 15, iPhone 14, iPhone 13, iPhone 12)
- **Level 3**: Sub-subcategories (Specific iPhone model variants)

## Database Schema

### Tables Created
1. `sub_subcategories` - Third level category table
2. `iphone_categories_hierarchy` - View for complete hierarchy

### Hierarchy Structure

```
iPhone Cases
├── iPhone 17
│   ├── iPhone 17 Pro Max
│   ├── iPhone 17 Pro
│   ├── iPhone 17 Air
│   └── iPhone 17
├── iPhone 16
│   ├── iPhone 16 Pro Max
│   ├── iPhone 16 Pro
│   ├── iPhone 16 Plus
│   ├── iPhone 16e
│   └── iPhone 16
├── iPhone 15
│   ├── iPhone 15 Pro Max
│   ├── iPhone 15 Pro
│   ├── iPhone 15 Plus
│   └── iPhone 15
├── iPhone 14
│   ├── iPhone 14 Pro Max
│   ├── iPhone 14 Pro
│   ├── iPhone 14 Plus
│   └── iPhone 14
├── iPhone 13
│   ├── iPhone 13 Pro Max
│   ├── iPhone 13 Pro
│   ├── iPhone 13 Mini
│   └── iPhone 13
└── iPhone 12
    ├── iPhone 12 Pro Max
    ├── iPhone 12 Pro
    ├── iPhone 12 Mini
    └── iPhone 12
```

## Setup Instructions

### 1. Run the SQL Migration

Copy the SQL script from `backend/migrations/iphone-categories-schema.sql` and run it in your Supabase SQL Editor.

### 2. Files Created

- `backend/models/SubSubCategory.js` - Mongoose model (for future use)
- `backend/models/SupabaseSubSubCategory.js` - Supabase service model
- `backend/controllers/iphoneCategoryController.js` - API controller
- `backend/routes/categories.js` - Updated with new routes
- `backend/scripts/setup-iphone-categories.js` - Setup script

### 3. API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/categories/iphone/hierarchy` | Get complete iPhone hierarchy grouped by subcategories |
| `GET /api/categories/all/with-subcategories` | Get all categories with their subcategories |
| `GET /api/categories/:categorySlug/subcategories/:subcategorySlug/sub-subcategories` | Get sub-subcategories for a specific subcategory |

### 4. Example API Responses

#### iPhone Hierarchy Response
```json
{
  "success": true,
  "data": {
    "category": {
      "name": "iPhone Cases",
      "slug": "iphone-cases"
    },
    "subcategories": [
      {
        "name": "iPhone 17",
        "slug": "iphone-17",
        "id": "uuid",
        "variants": [
          {
            "name": "iPhone 17 Pro Max",
            "slug": "iphone-17-pro-max",
            "id": "uuid"
          }
          // ... more variants
        ]
      }
      // ... more subcategories
    ]
  }
}
```

## Usage in Frontend

### Navigation Menu
Use the hierarchy endpoint to build the navigation menu:

```javascript
// Fetch iPhone hierarchy
fetch('/api/categories/iphone/hierarchy')
  .then(response => response.json())
  .then(data => {
    // Build navigation menu
    const iphoneCases = data.data.subcategories;
    // Render navigation items
  });
```

### Product Filtering
Use the sub-subcategory slugs for product filtering:

```javascript
// Filter products by specific iPhone model
const products = await fetch(`/api/products?category=iphone-cases&subcategory=iphone-15&subSubcategory=iphone-15-pro-max`);
```

## Database Views

### iphone_categories_hierarchy View
This view provides easy access to the complete hierarchy with the following columns:
- `category_name`, `category_slug`, `category_id`
- `subcategory_name`, `subcategory_slug`, `subcategory_id`
- `sub_subcategory_name`, `sub_subcategory_slug`, `sub_subcategory_id`

## Security

All tables have Row Level Security (RLS) policies:
- Public read access for active categories
- Service role full access for admin operations

## Next Steps

1. **Test the API endpoints** to ensure they work correctly
2. **Update frontend navigation** to use the new hierarchy
3. **Create admin interface** for managing categories
4. **Add products** to the appropriate sub-subcategories
5. **Implement filtering** in product listings

## Notes

- The hierarchy matches exactly the navigation menu design from the provided image
- All slugs are SEO-friendly and follow a consistent naming pattern
- The system is extensible - you can add more iPhone models or other product categories
- Uses Supabase for database operations with proper error handling and logging
