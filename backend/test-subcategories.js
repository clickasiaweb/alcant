require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAndCreateSubcategoriesTable() {
  try {
    console.log('Testing subcategories table...');
    
    // First, try to select from subcategories table
    const { data, error } = await supabase
      .from('subcategories')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('Subcategories table does not exist or has issues:', error.message);
      console.log('Attempting to create subcategories table...');
      
      // Read and execute the SQL script
      const fs = require('fs');
      const path = require('path');
      const sqlScript = fs.readFileSync(path.join(__dirname, 'sql/create-subcategories-table.sql'), 'utf8');
      
      // Split the script into individual statements
      const statements = sqlScript
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      console.log(`Executing ${statements.length} SQL statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            const { error: execError } = await supabase.rpc('exec_sql', { sql_query: statement });
            if (execError) {
              console.log(`Statement ${i + 1} failed:`, execError.message);
              console.log('Statement:', statement.substring(0, 100) + '...');
            } else {
              console.log(`Statement ${i + 1} executed successfully`);
            }
          } catch (err) {
            console.log(`Statement ${i + 1} error:`, err.message);
          }
        }
      }
      
      // Test again after creation
      console.log('Testing subcategories table after creation...');
      const { data: testData, error: testError } = await supabase
        .from('subcategories')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Still cannot access subcategories table:', testError);
        return false;
      } else {
        console.log('✅ Subcategories table created successfully!');
      }
    } else {
      console.log('✅ Subcategories table already exists!');
    }
    
    // Get categories to test foreign key
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .limit(5);
    
    if (catError) {
      console.error('Error accessing categories table:', catError);
      return false;
    }
    
    console.log('Available categories:', categories);
    
    // Try to create a test subcategory
    if (categories.length > 0) {
      const testCategory = categories[0];
      console.log('Creating test subcategory for category:', testCategory.name);
      
      const { data: newSubcategory, error: createError } = await supabase
        .from('subcategories')
        .insert({
          name: 'Test Subcategory ' + Date.now(),
          slug: 'test-subcategory-' + Date.now(),
          category_id: testCategory.id,
          description: 'Test description',
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating subcategory:', createError);
        return false;
      } else {
        console.log('✅ Successfully created subcategory:', newSubcategory);
        
        // Clean up - delete the test subcategory
        await supabase
          .from('subcategories')
          .delete()
          .eq('id', newSubcategory.id);
        
        console.log('✅ Test subcategory cleaned up');
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

testAndCreateSubcategoriesTable().then(success => {
  if (success) {
    console.log('🎉 Subcategories table is ready!');
  } else {
    console.log('❌ Failed to set up subcategories table');
  }
  process.exit(success ? 0 : 1);
});
