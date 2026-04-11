# User Authentication & Database Storage Setup Guide

## Overview
This guide explains how to properly configure user authentication with database storage and disable email confirmation for your Alcant e-commerce website.

## Current Status
- **Database**: Supabase with proper user schema
- **Authentication**: Supabase Auth with email confirmation bypass
- **User Data Storage**: Automatic profile creation in `profiles` table
- **Email Confirmation**: Configured to be disabled

## Database Schema

### User Tables
1. **`auth.users`** (Supabase Auth) - Core authentication data
2. **`profiles`** - Extended user information
   - `id` (UUID, references auth.users)
   - `name` (TEXT)
   - `email` (TEXT)
   - `phone` (TEXT)
   - `address` (JSONB)
   - `created_at`, `updated_at`

### Additional User-Related Tables
- **`cart_items`** - User shopping cart
- **`wishlist`** - User wishlist items
- **`orders`** - User orders
- **`order_items`** - Order details
- **`search_history`** - User search queries

## Configuration Steps

### 1. Database Setup
Run the SQL script `disable-email-confirmation.sql` in your Supabase SQL Editor:

```sql
-- This script will:
-- - Auto-confirm all new user emails
-- - Ensure all users have corresponding profiles
-- - Create helper functions for email management
-- - Set up proper triggers
```

### 2. Supabase Dashboard Settings
Go to your Supabase Dashboard:
1. **Authentication** > **Settings**
2. Set **"Enable email confirmations"** to **OFF**
3. **Save** the settings

### 3. Frontend Configuration
The authentication service is already configured to:
- Bypass email confirmation during signup
- Automatically create user profiles
- Handle login without email verification

## Key Features

### Automatic Profile Creation
When a user signs up:
1. User account created in `auth.users`
2. Profile automatically created in `profiles` table
3. Email automatically confirmed
4. User can log in immediately

### User Data Storage
All user data is stored in the database:
- **Basic Info**: Name, email, phone
- **Address**: JSONB format for flexible address storage
- **Shopping Data**: Cart items, wishlist, orders
- **Activity**: Search history, order tracking

### Security Features
- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Authentication**: Secure token-based auth
- **Data Validation**: Proper constraints and checks
- **Privacy**: User data isolation

## Testing the Setup

### 1. Test User Registration
```javascript
// Test signup flow
const result = await authService.signUp('test@example.com', 'password123', {
  name: 'Test User',
  phone: '+1234567890',
  address: {
    street: '123 Test St',
    city: 'Test City',
    country: 'Test Country'
  }
});
```

### 2. Verify Database Storage
Check that the user appears in:
- `auth.users` table (authentication)
- `profiles` table (extended data)

### 3. Test Login Without Email Confirmation
```javascript
// Should work without email confirmation
const loginResult = await authService.signIn('test@example.com', 'password123');
```

## Troubleshooting

### Issue: User not created in profiles table
**Solution**: Run the SQL script to ensure triggers are properly set up

### Issue: Email confirmation still required
**Solution**: 
1. Check Supabase Dashboard settings
2. Run the bypass email confirmation SQL
3. Verify triggers are working

### Issue: User data not persisting
**Solution**: 
1. Check database connection
2. Verify RLS policies
3. Check environment variables

## File Locations

### Backend Files
- `backend/disable-email-confirmation.sql` - Database setup script
- `backend/supabase-auth-schema-fixed.sql` - Complete schema
- `backend/test-user-data-storage.js` - Testing script

### Frontend Files
- `frontend/lib/supabaseAuth.js` - Authentication service
- `frontend/contexts/SupabaseAuthContext.js` - Auth context

### Configuration Files
- `backend/config/supabase.js` - Database connection
- Environment variables for Supabase URL and keys

## Environment Variables Required
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key (optional)
```

## Best Practices

### 1. User Data Management
- Always validate user input
- Use proper error handling
- Implement rate limiting
- Secure sensitive data

### 2. Database Security
- Keep RLS policies updated
- Regular security audits
- Monitor user activity
- Backup user data

### 3. Performance
- Index user-related columns
- Cache frequently accessed data
- Optimize database queries
- Monitor database performance

## Next Steps

1. **Run the SQL setup script** in Supabase
2. **Configure dashboard settings** to disable email confirmation
3. **Test user registration** flow
4. **Verify database storage** is working
5. **Monitor user authentication** in production

## Support

If you encounter issues:
1. Check the error logs in Supabase
2. Verify environment variables
3. Test with the provided test script
4. Check browser console for frontend errors

---

**Note**: This setup ensures that user data is properly stored in the database and email confirmation is disabled, allowing immediate login after registration.
