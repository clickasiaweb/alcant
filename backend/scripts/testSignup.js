const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSignup() {
  try {
    console.log('🧪 Testing signup functionality...');
    
    const testEmail = 'testuser@example.com';
    const testPassword = 'testpass123';
    const testName = 'Test User';
    
    // Step 1: Create auth user
    console.log('📧 Creating test auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Step 2: Create user profile
    console.log('👤 Creating user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([{
        email: testEmail,
        name: testName,
        role: 'user',
        is_active: true
      }])
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Profile error:', profileError.message);
      return;
    }
    
    console.log('✅ User profile created:', profile);
    
    // Step 3: Test login
    console.log('🔐 Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('❌ Login error:', loginError.message);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🎉 Signup test completed successfully!');
    
    // Cleanup test user
    console.log('🧹 Cleaning up test user...');
    await supabase.auth.admin.deleteUser(authData.user.id);
    await supabase.from('users').delete().eq('email', testEmail);
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testSignup();
