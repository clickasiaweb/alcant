const { createClient } = require("@supabase/supabase-js");

async function testDatabaseStructure() {
  console.log('🔍 Testing Database Structure...\n');

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Test 1: Get a sample product to see its structure
    console.log('1️⃣ Fetching sample product...');
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    const { data, error } = await products;
    
    if (error) {
      console.error('❌ Error fetching product:', error);
      return;
    }
    
    if (products && products.length > 0) {
      const sampleProduct = products[0];
      console.log('📋 Sample Product Structure:');
      console.log('ID:', sampleProduct.id);
      console.log('Name:', sampleProduct.name);
      console.log('Category:', sampleProduct.category);
      console.log('Subcategory:', sampleProduct.subcategory);
      console.log('Subcategory ID:', sampleProduct.subcategoryId);
      console.log('Sub-subcategory:', sampleProduct.sub_subcategory);
      console.log('Sub-subcategory ID:', sampleProduct.sub_subcategory_id);
      console.log('---');
      
      // Test 2: Try filtering by different fields
      console.log('2️⃣ Testing filtering by subcategory_id...');
      const { data: subcategoryProducts } = await supabase
        .from('products')
        .select('*')
        .eq('subcategory_id', sampleProduct.subcategoryId)
        .limit(5);
      
      console.log('Products by subcategory_id:', subcategoryProducts.length || 0);
      
      console.log('3️⃣ Testing filtering by subcategory (name)...');
      const { data: subcategoryNameProducts } = await supabase
        .from('products')
        .select('*')
        .eq('subcategory', sampleProduct.subcategory)
        .limit(5);
      
      console.log('Products by subcategory (name):', subcategoryNameProducts.length || 0);
      
      console.log('4️⃣ Testing filtering by category...');
      const { data: categoryProducts } = await supabase
        .from('products')
        .select('*')
        .eq('category', sampleProduct.category)
        .limit(5);
      
      console.log('Products by category:', categoryProducts.length || 0);
      
    } else {
      console.log('❌ No products found in database');
    }
    
  } catch (error) {
    console.error('❌ Database test error:', error);
  }
}

// Run the test
testDatabaseStructure();
