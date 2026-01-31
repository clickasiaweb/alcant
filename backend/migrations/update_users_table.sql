-- Update users table to remove password column (handled by Supabase Auth)
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Ensure the table structure is correct
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
