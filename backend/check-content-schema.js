const { supabase } = require('./config/supabase');

async function checkTableSchema() {
  try {
    console.log('Checking content table schema...');
    
    // Try to get table info using PostgreSQL query
    const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'content' });
    
    if (error) {
      console.error('Error getting schema:', error);
      
      // Try alternative approach - describe table
      const { data: descData, error: descError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'content');
        
      if (descError) {
        console.error('Error describing table:', descError);
      } else {
        console.log('Table columns:', descData);
      }
    } else {
      console.log('Table schema:', data);
    }
    
    // Try a simple select to see what happens
    const { data: testData, error: testError } = await supabase
      .from('content')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('Error selecting from content:', testError);
    } else {
      console.log('Sample data:', testData);
    }
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkTableSchema();
