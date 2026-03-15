require('dotenv').config();
const { supabase } = require('./config/supabase');

async function checkCategories() {
  try {
    console.log('🔍 Checking existing categories...');
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    
    if (categories && categories.length > 0) {
      console.log('✅ Found existing categories:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (ID: ${cat.id})`);
      });
    } else {
      console.log('❌ No categories found in database');
      console.log('💡 You need to create some categories first');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkCategories();
