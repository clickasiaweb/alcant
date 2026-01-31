const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsers() {
  try {
    console.log('🔍 Checking users table...');
    
    // Check table structure
    const { data: columns, error: columnError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (columnError) {
      console.error('❌ Error accessing users table:', columnError.message);
      return;
    }
    
    console.log('✅ Users table accessible');
    
    // Check existing users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, name, role, is_active, created_at');
    
    if (userError) {
      console.error('❌ Error fetching users:', userError.message);
      return;
    }
    
    console.log(`📊 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Active: ${user.is_active}`);
    });
    
    // Check if admin@example.com profile exists
    const adminProfile = users.find(u => u.email === 'admin@example.com');
    if (adminProfile) {
      console.log('✅ Admin profile exists');
    } else {
      console.log('⚠️  Admin profile missing, creating...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert([{
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          is_active: true
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating admin profile:', createError.message);
      } else {
        console.log('✅ Admin profile created');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
