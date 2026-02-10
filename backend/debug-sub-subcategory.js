require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSubSubcategoryCreation() {
  try {
    console.log('🔍 Debugging sub-subcategory creation...');
    
    // Test the exact data that the controller should be creating
    const subSubcategoryData = {
      name: 'Debug Sub-Subcategory',
      slug: 'debug-sub-subcategory',
      subcategory_id: '3207f43f-b904-486e-b2e5-9c6230eb7793', // iPhone Cases subcategory
      description: 'Debug test',
      sort_order: 0,
      is_active: true
    };
    
    console.log('📤 Data to be inserted:', JSON.stringify(subSubcategoryData, null, 2));
    
    // Directly insert into database
    const { data, error } = await supabase
      .from('sub_subcategories')
      .insert(subSubcategoryData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      return false;
    }
    
    console.log('✅ Successfully created:', JSON.stringify(data, null, 2));
    
    // Clean up
    await supabase
      .from('sub_subcategories')
      .delete()
      .eq('id', data.id);
    
    console.log('🧹 Test data cleaned up');
    return true;
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return false;
  }
}

debugSubSubcategoryCreation().then(success => {
  console.log(success ? '🎉 Debug completed successfully' : '💥 Debug failed');
  process.exit(success ? 0 : 1);
});
