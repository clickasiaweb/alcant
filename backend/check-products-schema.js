require('dotenv').config();
const { supabase } = require('./config/supabase');

async function checkProductsSchema() {
  try {
    console.log('🔍 Checking products table schema...');
    
    // Try to select a few columns to see what exists
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error checking products schema:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Found products table with columns:');
      Object.keys(data[0]).forEach(key => {
        console.log(`  - ${key}`);
      });
    } else {
      console.log('ℹ️ Products table is empty, but we can check the schema differently...');
      
      // Try to get column information
      const { data: columns, error: columnError } = await supabase
        .from('products')
        .select('name, slug, description, price, stock, sku, category_id')
        .limit(0);
      
      if (columnError) {
        console.log('❌ Could not determine exact columns, but we know some exist');
      } else {
        console.log('✅ Basic columns confirmed');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProductsSchema();
