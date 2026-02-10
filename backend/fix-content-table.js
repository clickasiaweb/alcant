const { supabaseService } = require('./config/supabase');
const fs = require('fs');

async function fixContentTable() {
  try {
    console.log('Reading SQL file...');
    const sql = fs.readFileSync('./fix-content-table.sql', 'utf8');
    
    console.log('Executing SQL to fix content table...');
    const { data, error } = await supabaseService.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      // Try alternative approach - execute individual statements
      const statements = sql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing:', statement.substring(0, 100) + '...');
          const { error: stmtError } = await supabaseService.rpc('exec_sql', { 
            sql_query: statement.trim() 
          });
          
          if (stmtError) {
            console.error('Error in statement:', stmtError);
          } else {
            console.log('Statement executed successfully');
          }
        }
      }
    } else {
      console.log('Content table fixed successfully!');
    }
  } catch (error) {
    console.error('Error fixing content table:', error);
  }
}

fixContentTable();
