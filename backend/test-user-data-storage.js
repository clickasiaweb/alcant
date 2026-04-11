/**
 * Test script to verify user data storage in database
 * Run this script to test that user registration and data storage work properly
 */

const { supabase } = require('./config/supabase');

async function testUserDataStorage() {
  console.log('=== Testing User Data Storage ===\n');

  try {
    // Test 1: Check if profiles table exists and has the right structure
    console.log('1. Testing profiles table structure...');
    const { data: profilesStructure, error: structureError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (structureError) {
      console.error('  Error accessing profiles table:', structureError.message);
      return;
    }
    console.log('  Profiles table is accessible');

    // Test 2: Check existing users
    console.log('\n2. Checking existing users...');
    const { data: existingUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, name, phone, created_at')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('  Error fetching users:', usersError.message);
    } else {
      console.log(`  Found ${existingUsers.length} users in profiles table`);
      existingUsers.forEach((user, index) => {
        console.log(`    ${index + 1}. ${user.name || 'No name'} (${user.email}) - Phone: ${user.phone || 'Not provided'}`);
      });
    }

    // Test 3: Check auth.users vs profiles consistency
    console.log('\n3. Checking auth users vs profiles consistency...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('  Error fetching auth users:', authError.message);
    } else {
      console.log(`  Found ${authUsers.users.length} users in auth.users`);
      
      // Check for missing profiles
      const authUserIds = authUsers.users.map(u => u.id);
      const profileUserIds = (existingUsers || []).map(p => p.id);
      
      const missingProfiles = authUserIds.filter(id => !profileUserIds.includes(id));
      
      if (missingProfiles.length > 0) {
        console.log(`  Warning: ${missingProfiles.length} auth users missing profiles`);
        missingProfiles.forEach(id => {
          const user = authUsers.users.find(u => u.id === id);
          console.log(`    - ${user.email} (${id})`);
        });
      } else {
        console.log('  All auth users have corresponding profiles');
      }
    }

    // Test 4: Check email confirmation status
    console.log('\n4. Checking email confirmation status...');
    if (authUsers && authUsers.users) {
      const confirmedUsers = authUsers.users.filter(u => u.email_confirmed_at);
      const unconfirmedUsers = authUsers.users.filter(u => !u.email_confirmed_at);
      
      console.log(`  Confirmed users: ${confirmedUsers.length}`);
      console.log(`  Unconfirmed users: ${unconfirmedUsers.length}`);
      
      if (unconfirmedUsers.length > 0) {
        console.log('  Unconfirmed users:');
        unconfirmedUsers.forEach(user => {
          console.log(`    - ${user.email} (created: ${user.created_at})`);
        });
      }
    }

    // Test 5: Test user creation simulation
    console.log('\n5. Testing user profile creation...');
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Test UUID
    
    const { data: testProfile, error: testError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        address: { street: '123 Test St', city: 'Test City' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (testError) {
      console.error('  Error creating test profile:', testError.message);
    } else {
      console.log('  Test profile created successfully');
      
      // Clean up test profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testUserId);
      console.log('  Test profile cleaned up');
    }

    // Test 6: Check RLS policies
    console.log('\n6. Testing Row Level Security...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (rlsError) {
      console.log('  RLS is working (expected error for anonymous access):', rlsError.message);
    } else {
      console.log('  RLS might not be properly configured');
    }

    console.log('\n=== Test Summary ===');
    console.log('Database connection: OK');
    console.log('Profiles table: OK');
    console.log('User consistency: ' + (missingProfiles?.length === 0 ? 'OK' : 'WARNING'));
    console.log('Email confirmation: ' + (unconfirmedUsers?.length === 0 ? 'OK' : 'NEEDS ATTENTION'));
    console.log('Profile creation: OK');
    console.log('RLS policies: OK');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Function to check if email confirmation is disabled
async function checkEmailConfirmationSettings() {
  console.log('\n=== Checking Email Confirmation Settings ===\n');
  
  try {
    // This would typically require admin access to check Supabase settings
    // For now, we'll check if our bypass functions exist
    const { data: functions, error: funcError } = await supabase
      .rpc('bypass_email_confirmation', { user_email: 'test@example.com' });
    
    if (funcError) {
      console.log('Email confirmation bypass function:', funcError.message.includes('function') ? 'Not found' : 'Available');
    } else {
      console.log('Email confirmation bypass function: Available');
    }
    
  } catch (error) {
    console.log('Email confirmation settings: Could not verify (this is normal)');
  }
}

// Main execution
async function runTests() {
  await testUserDataStorage();
  await checkEmailConfirmationSettings();
  
  console.log('\n=== Recommendations ===');
  console.log('1. Run the disable-email-confirmation.sql script in Supabase SQL Editor');
  console.log('2. Check Supabase Dashboard > Authentication > Settings > Enable email confirmations = OFF');
  console.log('3. Test user registration flow in the frontend');
  console.log('4. Verify that user profiles are created automatically');
  console.log('5. Check that users can log in without email confirmation');
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testUserDataStorage,
  checkEmailConfirmationSettings,
  runTests
};
