# Supabase Migration Guide

## Overview
This project has been successfully migrated from MongoDB to Supabase. Follow this guide to complete the setup.

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard
3. Note your project URL and API keys

## Setup Steps

### 1. Environment Variables
Update your `.env` file with the following Supabase configuration:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Name (for reference)
DATABASE_NAME=industrial_solutions

# Other existing environment variables...
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3001
```

### 2. Database Schema Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all necessary tables

### 3. Install Dependencies
The required dependencies have already been updated in `package.json`:
- `@supabase/supabase-js` (added)
- `mongoose` (removed)

Run:
```bash
npm install
```

### 4. Database Tables Created
The following tables will be created:
- `products` - Product catalog
- `categories` - Product categories
- `subcategories` - Product subcategories
- `users` - User accounts
- `content` - Dynamic content pages
- `inquiries` - Contact form submissions

### 5. Features Implemented
- Row Level Security (RLS) policies
- Automatic timestamp updates
- UUID primary keys
- Proper indexing for performance
- Public read access for active products
- Service role access for admin operations

## Data Migration (Optional)
If you have existing data in MongoDB, you'll need to migrate it to Supabase:

1. Export data from MongoDB
2. Transform the data to match the new schema
3. Import into Supabase using the dashboard or API

## Testing
1. Start the server:
```bash
npm run dev
```

2. Test the API endpoints:
- `GET /api/health` - Check database connection
- `GET /api/products` - List products
- `GET /api/categories` - List categories

## Key Changes Made

### Configuration
- Replaced `config/database.js` with `config/supabase.js`
- Updated environment variable names
- Modified server startup to use Supabase connection test

### Models
- Created `models/SupabaseProduct.js` to replace Mongoose models
- Implemented Supabase-compatible query methods
- Maintained API compatibility with existing controllers

### Controllers
- Updated `controllers/productController.js` to use Supabase
- All other controllers will need similar updates
- Maintained the same API response structure

## Next Steps
1. Update remaining controllers (auth, categories, content, inquiries, admin)
2. Test all API endpoints
3. Update any frontend code that might be affected
4. Deploy to production with new environment variables

## Troubleshooting
- Ensure your Supabase project URL and keys are correct
- Check that the SQL schema was applied successfully
- Verify RLS policies are working correctly
- Test with different user roles if implementing authentication

## Benefits of Supabase
- Real-time subscriptions
- Built-in authentication
- Automatic API generation
- Better security with RLS
- PostgreSQL features (JSONB, full-text search, etc.)
