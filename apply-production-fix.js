// This script applies the production schema fix
// Run this with your Supabase credentials

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and service role key
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchemaFix() {
  try {
    console.log('Applying schema fixes to production...');
    
    // Make user_id nullable
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;'
    });
    
    if (error1) {
      console.error('Error making user_id nullable:', error1);
    } else {
      console.log('✓ Made user_id nullable');
    }
    
    // Make order_number nullable
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders ALTER COLUMN order_number DROP NOT NULL;'
    });
    
    if (error2) {
      console.error('Error making order_number nullable:', error2);
    } else {
      console.log('✓ Made order_number nullable');
    }
    
    // Verify changes
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, is_nullable, data_type')
      .eq('table_name', 'orders')
      .in('column_name', ['user_id', 'order_number']);
    
    if (error) {
      console.error('Error verifying changes:', error);
    } else {
      console.log('Schema verification:', data);
    }
    
    console.log('Schema fix completed!');
    
  } catch (error) {
    console.error('Error applying schema fix:', error);
  }
}

applySchemaFix();
