const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function recreateUsersTable() {
  try {
    console.log('🔧 Recreating users table...');
    
    // Drop the existing table
    console.log('🗑️  Dropping existing users table...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS users CASCADE;'
    });
    
    if (dropError && !dropError.message.includes('does not exist')) {
      console.log('⚠️  Could not drop table, will try to recreate...');
    }
    
    // Create the table with correct structure
    console.log('📝 Creating new users table...');
    const createTableSQL = `
      CREATE TABLE users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
      CREATE INDEX idx_users_is_active ON users(is_active);
      
      -- Create triggers
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (createError) {
      console.error('❌ Error creating table:', createError.message);
      console.log('\n📋 Please run this SQL manually in your Supabase SQL Editor:');
      console.log(createTableSQL);
      return;
    }
    
    console.log('✅ Users table recreated successfully');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      email_confirm: true
    });
    
    if (authError && !authError.message.includes('already registered')) {
      console.error('❌ Error creating admin auth user:', authError.message);
    } else {
      console.log('✅ Admin auth user ready');
    }
    
    // Create admin profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([{
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        is_active: true
      }])
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Error creating admin profile:', profileError.message);
    } else {
      console.log('✅ Admin profile created');
    }
    
    console.log('\n🎉 Setup completed!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Manual SQL to run in Supabase SQL Editor:');
    console.log(`
-- Drop existing table
DROP TABLE IF EXISTS users CASCADE;

-- Create new table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Create trigger
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  }
}

recreateUsersTable();
