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

async function createTablesDirectly() {
    try {
        console.log('🔧 Creating tables directly...');
        
        // Create users table first
        console.log('📝 Creating users table...');
        
        const { error: usersError } = await supabase.rpc('exec', {
            sql: `
                CREATE TABLE IF NOT EXISTS users (
                    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        
        if (usersError) {
            console.log('⚠️  Users table creation error:', usersError.message);
        } else {
            console.log('✅ Users table created successfully');
        }
        
        // Create admin settings table
        console.log('📝 Creating admin_settings table...');
        
        const { error: settingsError } = await supabase.rpc('exec', {
            sql: `
                CREATE TABLE IF NOT EXISTS admin_settings (
                    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    key VARCHAR(255) NOT NULL UNIQUE,
                    value TEXT,
                    description TEXT,
                    is_public BOOLEAN DEFAULT false,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `
        });
        
        if (settingsError) {
            console.log('⚠️  Settings table creation error:', settingsError.message);
        } else {
            console.log('✅ Settings table created successfully');
        }
        
        // Create admin notifications table
        console.log('📝 Creating admin_notifications table...');
        
        const { error: notificationsError } = await supabase.rpc('exec', {
            sql: `
                CREATE TABLE IF NOT EXISTS admin_notifications (
                    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
                    is_read BOOLEAN DEFAULT false,
                    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    expires_at TIMESTAMP WITH TIME ZONE
                );
            `
        });
        
        if (notificationsError) {
            console.log('⚠️  Notifications table creation error:', notificationsError.message);
        } else {
            console.log('✅ Notifications table created successfully');
        }
        
        // Now try to create the admin user
        console.log('\n👤 Creating admin user...');
        
        const adminData = {
            email: 'admin@industrialsolutions.com',
            name: 'System Administrator',
            role: 'admin',
            is_active: true
        };
        
        const { data: newAdmin, error: createError } = await supabase
            .from('users')
            .insert([adminData])
            .select()
            .single();
        
        if (createError) {
            console.error('❌ Error creating admin:', createError.message);
            
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id, email')
                .eq('email', adminData.email)
                .single();
            
            if (existingUser) {
                console.log('✅ Admin user already exists:', existingUser.email);
                console.log('🆔 ID:', existingUser.id);
            }
        } else {
            console.log('✅ Admin user created successfully!');
            console.log(`📧 Email: ${newAdmin.email}`);
            console.log(`🆔 ID: ${newAdmin.id}`);
            console.log(`🔑 Role: ${newAdmin.role}`);
        }
        
        // Insert default admin settings
        console.log('\n⚙️  Creating default admin settings...');
        
        const defaultSettings = [
            {
                key: 'site_name',
                value: 'Industrial Solutions',
                description: 'Website name',
                is_public: true
            },
            {
                key: 'site_description',
                value: 'Premium Industrial Equipment and Solutions',
                description: 'Website description',
                is_public: true
            },
            {
                key: 'contact_email',
                value: 'admin@industrialsolutions.com',
                description: 'Main contact email',
                is_public: true
            },
            {
                key: 'maintenance_mode',
                value: 'false',
                description: 'Enable maintenance mode',
                is_public: false
            }
        ];
        
        const { data: settingsData, error: settingsInsertError } = await supabase
            .from('admin_settings')
            .insert(defaultSettings)
            .select();
        
        if (settingsInsertError) {
            console.log('⚠️  Settings insertion error:', settingsInsertError.message);
        } else {
            console.log(`✅ ${settingsData.length} default settings created`);
        }
        
        // Create welcome notification
        console.log('\n🔔 Creating welcome notification...');
        
        const { data: adminUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', 'admin@industrialsolutions.com')
            .single();
        
        if (adminUser) {
            const { data: notification, error: notificationError } = await supabase
                .from('admin_notifications')
                .insert([{
                    admin_id: adminUser.id,
                    title: 'Welcome to Admin Panel',
                    message: 'Your admin panel database has been successfully set up. You can now start managing your industrial solutions platform.',
                    type: 'success'
                }])
                .select()
                .single();
            
            if (notificationError) {
                console.log('⚠️  Notification creation error:', notificationError.message);
            } else {
                console.log('✅ Welcome notification created');
            }
        }
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('1. Go to your Supabase Dashboard > Authentication > Users');
        console.log('2. Create a user with email: admin@industrialsolutions.com');
        console.log('3. Set a secure password');
        console.log('4. Start your backend server');
        console.log('5. Start your admin panel');
        console.log('6. Login with the admin credentials');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Manual Setup Required:');
        console.log('1. Go to Supabase SQL Editor');
        console.log('2. Run the SQL from supabase-schema.sql');
        console.log('3. Run the SQL from migrations/admin-panel-schema.sql');
        console.log('4. Create admin user in Authentication > Users');
    }
}

createTablesDirectly();
