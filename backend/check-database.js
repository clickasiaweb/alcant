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

async function checkDatabase() {
    try {
        console.log('🔍 Checking database state...');
        
        // Check all tables
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_type', 'BASE TABLE');
        
        if (tablesError) {
            console.error('❌ Error getting tables:', tablesError.message);
        } else {
            console.log('📋 Existing tables:');
            tables.forEach(table => {
                console.log(`  - ${table.table_name}`);
            });
        }
        
        // Check if users table exists and its structure
        if (tables && tables.some(t => t.table_name === 'users')) {
            console.log('\n👥 Checking users table...');
            
            try {
                const { data: users, error: usersError } = await supabase
                    .from('users')
                    .select('*')
                    .limit(1);
                
                if (usersError) {
                    console.error('❌ Error accessing users table:', usersError.message);
                } else if (users && users.length > 0) {
                    console.log('✅ Users table columns:', Object.keys(users[0]));
                } else {
                    console.log('✅ Users table exists but is empty');
                    
                    // Try to insert a test user to see the required columns
                    console.log('🧪 Testing user insertion...');
                    
                    const testUser = {
                        email: 'test@example.com',
                        name: 'Test User',
                        role: 'user',
                        is_active: true
                    };
                    
                    const { data: newTestUser, error: testError } = await supabase
                        .from('users')
                        .insert([testUser])
                        .select()
                        .single();
                    
                    if (testError) {
                        console.error('❌ Test insertion failed:', testError.message);
                        console.log('🔧 This shows us what columns are required');
                    } else {
                        console.log('✅ Test user created successfully');
                        console.log('📋 Columns:', Object.keys(newTestUser));
                        
                        // Clean up test user
                        await supabase
                            .from('users')
                            .delete()
                            .eq('id', newTestUser.id);
                    }
                }
            } catch (e) {
                console.error('❌ Exception checking users table:', e.message);
            }
        }
        
        // Check admin tables
        const adminTables = [
            'admin_activity_logs',
            'admin_settings', 
            'admin_notifications',
            'admin_file_uploads',
            'admin_api_keys',
            'admin_backup_logs'
        ];
        
        console.log('\n🔧 Checking admin tables...');
        adminTables.forEach(tableName => {
            const exists = tables && tables.some(t => t.table_name === tableName);
            console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
        });
        
    } catch (error) {
        console.error('❌ Database check failed:', error.message);
    }
}

checkDatabase();
