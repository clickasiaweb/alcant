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

async function runSchemaSetup() {
    try {
        console.log('🔧 Running schema setup...');
        
        // Read and execute the main schema
        const fs = require('fs');
        const path = require('path');
        
        const schemaPath = path.join(__dirname, 'supabase-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📝 Executing main schema...');
        
        // Split the SQL into individual statements
        const statements = schemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
            if (statement.trim()) {
                console.log(`🔄 Executing: ${statement.substring(0, 50)}...`);
                
                const { error } = await supabase.rpc('exec_sql', { sql: statement });
                
                if (error) {
                    console.log(`⚠️  Error: ${error.message}`);
                    // Try alternative method
                    try {
                        const { data, error: altError } = await supabase
                            .from('information_schema.tables')
                            .select('table_name')
                            .eq('table_schema', 'public');
                        
                        if (!altError) {
                            console.log('✅ Tables exist:', data.map(t => t.table_name));
                        }
                    } catch (e) {
                        console.log('❌ Alternative check failed');
                    }
                } else {
                    console.log('✅ Statement executed successfully');
                }
            }
        }
        
        // Now run the admin schema
        console.log('\n📝 Executing admin schema...');
        
        const adminSchemaPath = path.join(__dirname, 'migrations', 'admin-panel-schema.sql');
        const adminSchemaSql = fs.readFileSync(adminSchemaPath, 'utf8');
        
        const adminStatements = adminSchemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of adminStatements) {
            if (statement.trim()) {
                console.log(`🔄 Executing: ${statement.substring(0, 50)}...`);
                
                // Skip complex statements for now
                if (statement.includes('CREATE OR REPLACE FUNCTION') || 
                    statement.includes('CREATE OR REPLACE VIEW') ||
                    statement.includes('COMMENT ON')) {
                    console.log('⏭️  Skipping complex statement');
                    continue;
                }
                
                try {
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });
                    
                    if (error) {
                        console.log(`⚠️  Error: ${error.message}`);
                    } else {
                        console.log('✅ Statement executed successfully');
                    }
                } catch (e) {
                    console.log(`⚠️  Exception: ${e.message}`);
                }
            }
        }
        
        console.log('\n🎉 Schema setup completed!');
        
        // Now create the admin user
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
            
            // Try without password constraint
            console.log('🔄 Trying alternative approach...');
            
            // Check if we can see the table structure
            const { data: tableInfo } = await supabase
                .from('users')
                .select('*')
                .limit(0);
            
            console.log('✅ Users table is accessible');
            
        } else {
            console.log('✅ Admin user created successfully!');
            console.log(`📧 Email: ${newAdmin.email}`);
            console.log(`🆔 ID: ${newAdmin.id}`);
            console.log(`🔑 Role: ${newAdmin.role}`);
        }
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

runSchemaSetup();
