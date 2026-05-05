// Load environment variables
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkProductImages() {
  try {
    console.log('🔍 Checking product images in database...\n');
    
    const { data, error } = await supabase
      .from('products')
      .select('name, images, image')
      .limit(5);
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No products found in database');
      return;
    }
    
    console.log(`📦 Found ${data.length} products:\n`);
    
    data.forEach((product, index) => {
      console.log(`${index + 1}. 📦 Product: ${product.name}`);
      console.log(`   🖼️ Main image: ${product.image || 'None'}`);
      
      if (product.images) {
        console.log(`   📸 Images array (${product.images.length} items):`);
        
        if (Array.isArray(product.images)) {
          product.images.forEach((img, imgIndex) => {
            console.log(`     ${imgIndex + 1}. Type: ${typeof img}`);
            console.log(`        URL: ${img}`);
            console.log(`        Valid URL: ${img && (img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:'))}`);
          });
        } else {
          console.log(`     Type: ${typeof product.images}`);
          console.log(`     Value: ${product.images}`);
        }
      } else {
        console.log(`   📸 Images array: None`);
      }
      
      console.log('');
    });
    
    console.log('✅ Database check completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProductImages();
