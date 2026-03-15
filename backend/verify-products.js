require('dotenv').config();
const { supabase } = require('./config/supabase');

async function verifyProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    if (products && products.length > 0) {
      console.log(`✅ Found ${products.length} products in database:`);
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price} (ID: ${product.id})`);
      });
    } else {
      console.log('❌ No products found in database');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyProducts();
