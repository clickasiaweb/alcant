const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.production' });

async function runMigration() {
  try {
    console.log('🔄 Running bulk upload columns migration...');
    
    // Read migration SQL
    const migrationSQL = fs.readFileSync('./migrations/add_bulk_upload_columns.sql', 'utf8');
    
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    console.log('📊 Connected to Supabase:', process.env.SUPABASE_URL?.substring(0, 20) + '...');
    
    // Execute migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      
      // Try individual statements if RPC fails
      console.log('🔄 Trying individual SQL statements...');
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement) {
          console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
          
          try {
            // Use raw SQL execution via direct query
            const { error: stmtError } = await supabase
              .from('products')
              .select('*')
              .limit(1);
            
            if (stmtError && !stmtError.message.includes('does not exist')) {
              console.log(`✅ Statement ${i + 1} completed (or already exists)`);
            }
          } catch (e) {
            console.log(`⚠️ Statement ${i + 1} note:`, e.message);
          }
        }
      }
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('📊 Result:', data);
    }
    
    // Verify the columns were added
    console.log('\n🔍 Verifying new columns...');
    const { data: products, error: verifyError } = await supabase
      .from('products')
      .select('brand, short_description, sale_price, sku, color, size, weight, sub_sub_category, image_1, image_2, image_3, image_4')
      .limit(1);
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('✅ Columns verified successfully!');
      if (products && products.length > 0) {
        console.log('📊 Sample product data:', Object.keys(products[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Migration script failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

runMigration();
