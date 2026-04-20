const { supabaseService } = require('./config/supabase');

async function checkCurrentSchema() {
  console.log('Checking current Supabase schema...\n');

  try {
    // Check products table structure
    console.log('=== PRODUCTS TABLE STRUCTURE ===');
    const { data: productsInfo, error: productsError } = await supabaseService
      .from('products')
      .select('*')
      .limit(1);

    if (productsError) {
      console.log('Products table error:', productsError.message);
    } else {
      console.log('Products table exists');
      if (productsInfo && productsInfo.length > 0) {
        console.log('Sample product fields:', Object.keys(productsInfo[0]));
      }
    }

    // Check if brand column exists by trying to select it
    console.log('\n=== CHECKING BRAND COLUMN ===');
    const { data: brandCheck, error: brandError } = await supabaseService
      .from('products')
      .select('brand')
      .limit(1);

    if (brandError) {
      console.log('Brand column error:', brandError.message);
      if (brandError.message.includes('column "brand" does not exist')) {
        console.log('Brand column does NOT exist in products table');
      }
    } else {
      console.log('Brand column EXISTS in products table');
      if (brandCheck && brandCheck.length > 0) {
        console.log('Sample brand value:', brandCheck[0].brand);
      }
    }

    // Get table information using PostgreSQL query
    console.log('\n=== DETAILED TABLE STRUCTURE ===');
    const { data: tableInfo, error: tableError } = await supabaseService
      .rpc('get_table_info', { table_name: 'products' });

    if (tableError) {
      console.log('Table info error (expected if RPC not exists):', tableError.message);
      
      // Alternative: Use information_schema
      console.log('\n=== USING INFORMATION_SCHEMA ===');
      const { data: schemaInfo, error: schemaError } = await supabaseService
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'products')
        .eq('table_schema', 'public')
        .order('ordinal_position');

      if (schemaError) {
        console.log('Schema info error:', schemaError.message);
      } else {
        console.log('Products table columns:');
        schemaInfo.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
      }
    } else {
      console.log('Table info:', tableInfo);
    }

    // Check all tables
    console.log('\n=== ALL TABLES ===');
    const { data: tables, error: tablesError } = await supabaseService
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (tablesError) {
      console.log('Tables error:', tablesError.message);
    } else {
      console.log('Available tables:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

  } catch (error) {
    console.error('Schema check error:', error);
  }
}

checkCurrentSchema();
