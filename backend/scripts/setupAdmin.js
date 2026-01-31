const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user...');

    // Step 1: Create auth user
    console.log('📧 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      email_confirm: true
    });

    if (authError && !authError.message.includes('already registered')) {
      throw authError;
    }

    const userId = authData.user?.id;

    // Step 2: Create user profile
    console.log('👤 Creating user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .upsert([{
        id: userId || undefined, // Use the auth user ID if available
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        is_active: true
      }])
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    console.log('✅ Admin user setup completed!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: admin');
    console.log('\n🌐 You can now login to the admin panel at: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('password')) {
      console.log('\n💡 Make sure you ran the migration to remove the password column from users table');
      console.log('   Run this in your Supabase SQL editor:');
      console.log('   ALTER TABLE users DROP COLUMN IF EXISTS password;');
    }
    
    process.exit(1);
  }
}

setupAdmin();
