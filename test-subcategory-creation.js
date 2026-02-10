const { supabase } = require('./backend/config/supabase');

async function testSubcategoryTable() {
  try {
    console.log('Testing subcategories table existence...');
    
    // Try to select from subcategories table
    const { data, error } = await supabase
      .from('subcategories')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error accessing subcategories table:', error);
      return;
    }
    
    console.log('Subcategories table exists!');
    console.log('Sample data:', data);
    
    // Try to get categories to test foreign key
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .limit(5);
    
    if (catError) {
      console.error('Error accessing categories table:', catError);
      return;
    }
    
    console.log('Available categories:', categories);
    
    // Try to create a test subcategory
    if (categories.length > 0) {
      const testCategory = categories[0];
      console.log('Creating test subcategory for category:', testCategory.name);
      
      const { data: newSubcategory, error: createError } = await supabase
        .from('subcategories')
        .insert({
          name: 'Test Subcategory',
          slug: 'test-subcategory',
          category_id: testCategory.id,
          description: 'Test description',
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating subcategory:', createError);
      } else {
        console.log('Successfully created subcategory:', newSubcategory);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSubcategoryTable();
