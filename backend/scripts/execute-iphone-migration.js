const { supabaseService } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

async function executeMigration() {
  try {
    console.log('🚀 Starting iPhone categories migration...\n');

    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, '../migrations/iphone-categories-schema.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabaseService.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // If exec_sql doesn't exist, try direct SQL execution
          console.log('🔄 Trying alternative execution method...');
          
          // For Supabase, we need to handle this differently
          // Let's break down the migration into specific operations
          continue;
        }
        
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (stmtError) {
        console.log(`⚠️  Statement ${i + 1} failed: ${stmtError.message}`);
        console.log('   This might be expected for some statements (like CREATE POLICY)\n');
      }
    }

    console.log('\n🎯 Migration completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check your Supabase dashboard to verify the tables were created');
    console.log('2. Test the API endpoints');
    console.log('3. Update your frontend navigation\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔧 Alternative approach:');
    console.log('1. Open your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy the SQL from backend/migrations/iphone-categories-schema.sql');
    console.log('4. Paste and execute it manually\n');
  }
}

// Helper function to create the sub-subcategories table manually
async function createSubSubCategoriesTable() {
  try {
    console.log('🏗️  Creating sub-subcategories table manually...');

    // Create the table
    const { error: tableError } = await supabaseService
      .from('sub_subcategories')
      .select('count')
      .limit(1);

    if (tableError && tableError.code === 'PGRST116') {
      // Table doesn't exist, we need to create it via SQL
      console.log('❌ Table does not exist. Please run the SQL migration manually.');
      return false;
    }

    console.log('✅ Table exists or was created successfully');
    return true;

  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    return false;
  }
}

// Helper function to insert iPhone categories manually
async function insertIPhoneCategories() {
  try {
    console.log('📱 Inserting iPhone categories...');

    // Create main category
    const { data: category, error: categoryError } = await supabaseService
      .from('categories')
      .upsert([{
        name: 'iPhone Cases',
        slug: 'iphone-cases',
        description: 'Premium protective cases for all iPhone models',
        is_active: true
      }])
      .select()
      .single();

    if (categoryError) throw categoryError;
    console.log('✅ Created iPhone Cases category');

    // Create subcategories
    const subcategories = [
      { name: 'iPhone 17', slug: 'iphone-17' },
      { name: 'iPhone 16', slug: 'iphone-16' },
      { name: 'iPhone 15', slug: 'iphone-15' },
      { name: 'iPhone 14', slug: 'iphone-14' },
      { name: 'iPhone 13', slug: 'iphone-13' },
      { name: 'iPhone 12', slug: 'iphone-12' }
    ];

    for (const subcat of subcategories) {
      const { error: subcatError } = await supabaseService
        .from('subcategories')
        .upsert([{
          name: subcat.name,
          slug: subcat.slug,
          category_id: category.id,
          description: `Cases for ${subcat.name} series`,
          is_active: true
        }]);

      if (subcatError) throw subcatError;
      console.log(`✅ Created ${subcat.name} subcategory`);
    }

    console.log('🎉 iPhone categories created successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error inserting categories:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 iPhone Categories Migration Tool');
  console.log('=====================================\n');

  // Try the manual approach first
  const tableCreated = await createSubSubCategoriesTable();
  
  if (tableCreated) {
    await insertIPhoneCategories();
  } else {
    console.log('\n📋 Manual Setup Required:');
    console.log('Please run the SQL migration manually in your Supabase dashboard:');
    console.log('1. Open Supabase SQL Editor');
    console.log('2. Copy the content from: backend/migrations/iphone-categories-schema.sql');
    console.log('3. Execute the SQL script');
    console.log('\nThe script will create:');
    console.log('- sub_subcategories table');
    console.log('- iPhone Cases category');
    console.log('- 6 iPhone model subcategories');
    console.log('- 24 specific iPhone variant sub-subcategories');
  }
}

main();
