const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function checkUsersTable() {
    try {
        console.log('🔍 Checking users table structure...');
        
        // Get table info
        const { data: columns, error } = await supabase
            .rpc('get_table_columns', { table_name: 'users' })
            .select('*');
        
        if (error) {
            console.log('⚠️  Could not get table columns, trying alternative method...');
            
            // Try to describe the table
            const { data: sampleData, error: sampleError } = await supabase
                .from('users')
                .select('*')
                .limit(1);
            
            if (sampleError) {
                console.error('❌ Error accessing users table:', sampleError.message);
            } else {
                console.log('✅ Users table columns:', Object.keys(sampleData[0] || {}));
            }
        } else {
            console.log('✅ Users table columns:', columns);
        }
        
        // Check existing users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, email, role, is_active')
            .limit(5);
        
        if (usersError) {
            console.error('❌ Error fetching users:', usersError.message);
        } else {
            console.log('📋 Existing users:', users);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkUsersTable();
