const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration. Please check your .env file:');
    console.error('   - SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * Create initial admin user
 */
async function createInitialAdmin() {
    try {
        console.log('🔧 Creating initial admin user...');
        
        const adminData = {
            email: 'admin@industrialsolutions.com',
            name: 'System Administrator',
            role: 'admin',
            is_active: true
        };

        // Check if admin already exists in users table
        const { data: existingAdmin, error: checkError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', adminData.email)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingAdmin) {
            console.log(`✅ Admin user already exists in users table: ${existingAdmin.email}`);
            
            // Check if user exists in Supabase Auth
            const { data: authUser, error: authCheckError } = await supabase.auth.admin.getUserById(existingAdmin.id);
            
            if (authCheckError) {
                console.log(`⚠️  User exists in users table but not in Supabase Auth`);
                console.log(`   You need to create this user in Supabase Auth dashboard`);
            } else {
                console.log(`✅ Admin user exists in both users table and Supabase Auth`);
            }
            
            return existingAdmin.id;
        }

        // Create admin user in users table only (password handled by Supabase Auth)
        const { data: newAdmin, error: createError } = await supabase
            .from('users')
            .insert([adminData])
            .select()
            .single();

        if (createError) {
            throw createError;
        }

        console.log(`✅ Admin user created in users table: ${newAdmin.email}`);
        console.log(`📧 Email: ${newAdmin.email}`);
        console.log(`👤 Name: ${newAdmin.name}`);
        console.log(`🔑 Role: ${newAdmin.role}`);
        console.log(`🆔 ID: ${newAdmin.id}`);
        
        console.log(`\n⚠️  IMPORTANT: You need to create this user in Supabase Auth!`);
        console.log(`   1. Go to your Supabase project`);
        console.log(`   2. Navigate to Authentication > Users`);
        console.log(`   3. Create a new user with email: ${adminData.email}`);
        console.log(`   4. Set a temporary password`);
        console.log(`   5. Make sure to set the user ID to: ${newAdmin.id}`);
        console.log(`   6. The user can then login and change their password`);

        return newAdmin.id;

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        throw error;
    }
}

/**
 * Create sample admin notifications
 */
async function createSampleNotifications(adminId) {
    try {
        console.log('🔔 Creating sample admin notifications...');

        const notifications = [
            {
                admin_id: adminId,
                title: 'Welcome to Admin Panel',
                message: 'Your admin account has been successfully created. Start managing your industrial solutions platform.',
                type: 'success'
            },
            {
                admin_id: adminId,
                title: 'Security Reminder',
                message: 'Please ensure you use a strong password and enable two-factor authentication for your account.',
                type: 'warning'
            },
            {
                admin_id: adminId,
                title: 'Setup Checklist',
                message: 'Review your admin settings and configure your platform preferences.',
                type: 'info'
            }
        ];

        const { data, error } = await supabase
            .from('admin_notifications')
            .insert(notifications)
            .select();

        if (error) {
            throw error;
        }

        console.log(`✅ Created ${data.length} sample notifications`);

    } catch (error) {
        console.error('❌ Error creating notifications:', error.message);
        throw error;
    }
}

/**
 * Test database connection and permissions
 */
async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing database connection...');

        // Test basic connection
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            throw error;
        }

        console.log('✅ Database connection successful');

        // Test admin tables exist
        const adminTables = [
            'admin_activity_logs',
            'admin_settings',
            'admin_notifications',
            'admin_file_uploads',
            'admin_api_keys',
            'admin_backup_logs'
        ];

        for (const table of adminTables) {
            try {
                await supabase.from(table).select('count').limit(1);
                console.log(`✅ Table ${table} exists and accessible`);
            } catch (error) {
                console.log(`⚠️  Table ${table} may not exist or is not accessible`);
                console.log(`   Run the admin-panel-schema.sql migration first`);
            }
        }

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
}

/**
 * Display setup instructions
 */
function displayInstructions() {
    console.log('\n📋 Admin Panel Database Setup Instructions');
    console.log('==========================================');
    console.log('\n1️⃣  Run the schema migrations:');
    console.log('   - First run: supabase-schema.sql');
    console.log('   - Then run: migrations/admin-panel-schema.sql');
    console.log('\n2️⃣  Set up Supabase Auth for the admin user:');
    console.log('   - Go to Supabase Dashboard > Authentication > Users');
    console.log('   - Create user with email: admin@industrialsolutions.com');
    console.log('   - Set a secure password');
    console.log('\n3️⃣  Configure environment variables:');
    console.log('   - SUPABASE_URL: Your Supabase project URL');
    console.log('   - SUPABASE_ANON_KEY: Your Supabase anon key');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY: Your service role key');
    console.log('\n4️⃣  Update admin panel configuration:');
    console.log('   - Check backend/.env for correct settings');
    console.log('   - Ensure CORS origins are properly set');
    console.log('\n5️⃣  Test the admin panel:');
    console.log('   - Start the backend server');
    console.log('   - Start the admin panel frontend');
    console.log('   - Login with the admin credentials');
    console.log('\n🔐 Default Admin Credentials:');
    console.log('   Email: admin@industrialsolutions.com');
    console.log('   Password: (Set in Supabase Auth)');
}

/**
 * Main setup function
 */
async function setupAdminDatabase() {
    try {
        console.log('🚀 Starting Admin Panel Database Setup');
        console.log('=======================================');

        // Test connection
        await testDatabaseConnection();

        // Create initial admin user
        const adminId = await createInitialAdmin();

        // Create sample notifications
        await createSampleNotifications(adminId);

        console.log('\n🎉 Admin panel database setup completed successfully!');
        displayInstructions();

    } catch (error) {
        console.error('\n💥 Setup failed:', error.message);
        console.error('\n🔧 Please check:');
        console.error('   1. Supabase project is active');
        console.error('   2. Environment variables are correct');
        console.error('   3. Schema migrations have been run');
        console.error('   4. Service role key has proper permissions');
        process.exit(1);
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupAdminDatabase();
}

module.exports = {
    setupAdminDatabase,
    createInitialAdmin,
    testDatabaseConnection,
    supabase
};
