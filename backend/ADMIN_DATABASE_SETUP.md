# Admin Panel Database Setup Guide

This guide will help you set up the complete database for the Industrial Solutions admin panel.

## Prerequisites

1. **Supabase Project**: Create a free Supabase project at https://supabase.com
2. **Node.js**: Ensure Node.js 16+ is installed
3. **Environment Variables**: Configure your `.env` file

## Quick Setup

### 1. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run Setup Script

#### Option A: Automated Setup (Recommended)

```bash
# Make the setup script executable (on Unix/Linux/macOS)
chmod +x setup-admin-db.sh

# Run the setup script
./setup-admin-db.sh
```

#### Option B: Manual Setup

**Step 1: Run Database Schema**

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the `supabase-schema.sql` file
4. Then run the `migrations/admin-panel-schema.sql` file

**Step 2: Create Admin User**

```bash
node scripts/setup-admin-database.js
```

## Database Schema Overview

### Core Tables
- **users**: User management with role-based access
- **categories**: Product categories
- **subcategories**: Product subcategories  
- **products**: Product catalog
- **content**: Dynamic content pages
- **inquiries**: Customer inquiries

### Admin-Specific Tables
- **admin_activity_logs**: Audit trail for all admin actions
- **admin_settings**: Configuration settings
- **admin_notifications**: Admin notifications and alerts
- **admin_file_uploads**: File management system
- **admin_api_keys**: API key management
- **admin_backup_logs**: Backup operation logs

### Security Features
- **Row Level Security (RLS)**: Proper data access controls
- **Audit Logging**: Complete activity tracking
- **Role-Based Permissions**: Admin vs user access control
- **API Key Management**: Secure API access

## Default Admin Account

The setup creates a default admin account:
- **Email**: admin@industrialsolutions.com
- **Role**: admin
- **Status**: Active

### Setting Up Authentication

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Create a new user with email: `admin@industrialsolutions.com`
3. Set a secure password
4. The user can now login to the admin panel

## Testing the Setup

### 1. Test Database Connection

```bash
node scripts/setup-admin-database.js
```

### 2. Start Backend Server

```bash
npm run dev
```

### 3. Start Admin Panel

```bash
cd ../admin-panel
npm run dev
```

### 4. Login to Admin Panel

Navigate to `http://localhost:3002` and login with:
- Email: admin@industrialsolutions.com
- Password: (What you set in Supabase Auth)

## Troubleshooting

### Common Issues

**1. Connection Failed**
```
❌ Missing Supabase configuration
```
**Solution**: Check your `.env` file for correct Supabase URL and keys

**2. Permission Denied**
```
❌ Permission denied for table admin_activity_logs
```
**Solution**: Ensure you've run the schema migrations with service role key

**3. User Not Found**
```
❌ Admin user creation failed
```
**Solution**: Run the schema migrations first, then create the user

### Manual SQL Execution

If automated setup fails, manually run these SQL files in order:

1. **Main Schema**: `supabase-schema.sql`
2. **Admin Schema**: `migrations/admin-panel-schema.sql`

### Environment Variables Reference

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key  
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
DATABASE_NAME=industrial_solutions
NODE_ENV=development
JWT_SECRET=your-jwt-secret
PORT=5000
```

## Security Considerations

1. **Service Role Key**: Never expose this key in frontend code
2. **Row Level Security**: All tables have RLS policies configured
3. **Admin Permissions**: Only admins can access admin-specific tables
4. **Audit Logging**: All admin actions are logged automatically
5. **API Keys**: Use API keys for programmatic access

## Next Steps

1. **Customize Settings**: Update admin settings in the `admin_settings` table
2. **Configure Backups**: Set up automated backup schedules
3. **Set Up Monitoring**: Configure admin notifications for important events
4. **Customize Permissions**: Adjust RLS policies as needed
5. **Test All Features**: Verify all admin panel functionality

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the error logs in your terminal
3. Verify all SQL migrations ran successfully
4. Ensure environment variables are correctly set

## Database Schema Diagram

```
users (admin/user)
├── admin_activity_logs (audit trail)
├── admin_notifications (alerts)
├── admin_file_uploads (files)
└── admin_api_keys (API access)

categories
├── subcategories
└── products

content (pages)
inquiries (customer messages)
admin_settings (configuration)
admin_backup_logs (backup tracking)
```

This setup provides a complete, secure foundation for your Industrial Solutions admin panel.
