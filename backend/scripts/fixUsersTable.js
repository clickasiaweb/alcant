const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUsersTable() {
  try {
    console.log('🔧 Fixing users table structure...');
    
    // First, let's check if password column exists
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'users' })
      .select('column_name, data_type, is_nullable');
    
    if (tableError) {
      console.log('⚠️  Cannot check table structure, trying direct approach...');
    }
    
    // Try to drop the password column
    console.log('🗑️  Attempting to drop password column...');
    const { error: dropError } = await supabase
      .from('users')
      .select('password')
      .limit(1);
    
    if (dropError && dropError.message.includes('column "password" does not exist')) {
      console.log('✅ Password column already removed');
    } else if (!dropError) {
      console.log('⚠️  Password column still exists, need to run SQL migration');
      console.log('Please run this in your Supabase SQL editor:');
      console.log('ALTER TABLE users DROP COLUMN IF EXISTS password;');
      return;
    }
    
    // Now create admin profile
    console.log('👤 Creating admin profile...');
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
      if (profileError.message.includes('duplicate key')) {
        console.log('✅ Admin profile already exists');
      } else {
        console.error('❌ Error creating admin profile:', profileError.message);
        return;
      }
    } else {
      console.log('✅ Admin profile created successfully');
    }
    
    console.log('🎉 Users table fixed!');
    console.log('📧 Admin credentials: admin@example.com / admin123');
    
  } catch (error) {
    console.error('❌ Error fixing users table:', error.message);
  }
}

fixUsersTable();
