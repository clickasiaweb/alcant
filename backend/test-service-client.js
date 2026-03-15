require('dotenv').config();
const { supabase, supabaseService } = require('./config/supabase');

async function testServiceClient() {
  try {
    console.log('🔍 Testing service client...');
    
    // Check if service client exists
    if (!supabaseService) {
      console.log('❌ Service client is null');
      return;
    }
    
    console.log('✅ Service client exists');
    
    // Try to insert a test product
    const testProduct = {
      name: 'Test Product',
      slug: 'test-product-' + Date.now(),
      description: 'Test description',
      price: 9.99,
      category: 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be', // Phone Cases category ID
      stock: 10,
      rating: 0,
      reviews: 0,
      is_new: false,
      is_limited_edition: false,
      is_blue_monday_sale: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Trying to insert test product...');
    const { data, error } = await supabaseService
      .from('products')
      .insert(testProduct)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Service client error:', error);
    } else {
      console.log('✅ Successfully inserted test product:', data);
      
      // Clean up - delete the test product
      await supabaseService
        .from('products')
        .delete()
        .eq('id', data.id);
      
      console.log('🧹 Test product cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testServiceClient();
