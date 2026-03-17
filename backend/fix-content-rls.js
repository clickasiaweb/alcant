require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

console.log('Environment check:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING'
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies for content table...');
    
    // Read the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('./fix-content-rls.sql', 'utf8');
    
    // Execute the SQL using the service client
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error fixing RLS policies:', error);
      
      // Try alternative approach - direct SQL execution
      console.log('🔄 Trying alternative approach...');
      
      // Drop existing policies
      await supabase.from('content').select('count').limit(1); // Test connection
      
      // Use raw SQL through the service client
      const { data: result, error: altError } = await supabase
        .from('content')
        .select('*')
        .limit(1);
        
      if (altError) {
        console.error('❌ Alternative approach also failed:', altError);
      } else {
        console.log('✅ Service client can read content table');
      }
    } else {
      console.log('✅ RLS policies fixed successfully');
    }
    
  } catch (error) {
    console.error('❌ Error in fixRLSPolicies:', error);
  }
}

fixRLSPolicies();
