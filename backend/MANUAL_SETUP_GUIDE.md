# Quick Manual Database Setup Guide

Since the automated scripts are having issues with the existing database schema, here's the quick manual setup:

## Step 1: Go to Supabase Dashboard

1. Open https://supabase.com
2. Go to your project
3. Click on **SQL Editor** in the left sidebar

## Step 2: Run This SQL

Copy and paste this entire SQL script into the SQL Editor and click **Run**:

```sql
-- Check and handle existing users table
DO $$
BEGIN
    -- Check if users table has password constraint and drop it if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password'
    ) THEN
        DROP TABLE IF EXISTS users CASCADE;
        RAISE NOTICE 'Dropped existing users table with password constraint';
    END IF;
END $$;

-- Create users table (without password constraint - handled by Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_role') THEN
        CREATE INDEX idx_users_role ON users(role);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_settings_key') THEN
        CREATE INDEX idx_admin_settings_key ON admin_settings(key);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_notifications_admin_id') THEN
        CREATE INDEX idx_admin_notifications_admin_id ON admin_notifications(admin_id);
    END IF;
END $$;

-- Insert default admin settings (only if they don't exist)
INSERT INTO admin_settings (key, value, description, is_public) VALUES
('site_name', 'Industrial Solutions', 'Website name', true),
('site_description', 'Premium Industrial Equipment and Solutions', 'Website description', true),
('contact_email', 'admin@industrialsolutions.com', 'Main contact email', true),
('maintenance_mode', 'false', 'Enable maintenance mode', false)
ON CONFLICT (key) DO NOTHING;

-- Create admin user record (only if they don't exist)
INSERT INTO users (email, name, role, is_active) VALUES
('admin@industrialsolutions.com', 'System Administrator', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Create welcome notification for admin
INSERT INTO admin_notifications (admin_id, title, message, type) 
SELECT 
    id,
    'Welcome to Admin Panel',
    'Your admin panel database has been successfully set up. You can now start managing your industrial solutions platform.',
    'success'
FROM users 
WHERE email = 'admin@industrialsolutions.com'
AND NOT EXISTS (
    SELECT 1 FROM admin_notifications 
    WHERE title = 'Welcome to Admin Panel' 
    AND admin_id = users.id
);
```

## Step 3: Set Up Authentication

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - **Email**: admin@industrialsolutions.com
   - **Password**: Choose a secure password
4. Click **Save**

## Step 4: Test Everything

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your admin panel:
   ```bash
   cd ../admin-panel
   npm run dev
   ```

3. Go to http://localhost:3002
4. Login with:
   - **Email**: admin@industrialsolutions.com
   - **Password**: What you set in Step 3

## Step 5: Verify Database

You can verify the setup by running this in the SQL Editor:

```sql
-- Check users
SELECT * FROM users;

-- Check settings
SELECT * FROM admin_settings;

-- Check notifications
SELECT * FROM admin_notifications;
```

## Troubleshooting

If you get any errors:

1. **"relation already exists"**: Drop the table first with `DROP TABLE table_name CASCADE;`
2. **"permission denied"**: Make sure you're using the service role key
3. **"column does not exist"**: Make sure you ran the SQL in the correct order

## Success Indicators

✅ You should see:
- 1 user with email admin@industrialsolutions.com
- 4 default admin settings
- 1 welcome notification
- No error messages when running the SQL

That's it! Your admin panel database is now ready to use.
