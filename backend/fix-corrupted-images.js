// Load environment variables
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for write operations
);

async function fixCorruptedImages() {
  try {
    console.log('🔧 Fixing corrupted image data in database...\n');
    
    // Get all products with potentially corrupted images
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, image');
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️ No products found');
      return;
    }
    
    console.log(`📦 Checking ${products.length} products for corrupted images...\n`);
    
    let fixedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let updatedImages = product.images;
      let updatedMainImage = product.image;
      
      // Fix images array
      if (product.images && Array.isArray(product.images)) {
        updatedImages = product.images.map(img => {
          if (typeof img === 'string' && img.startsWith('{') && img.includes('"url"')) {
            try {
              const parsed = JSON.parse(img);
              console.log(`🔧 Fixing corrupted image in product "${product.name}"`);
              console.log(`   Before: ${img}`);
              console.log(`   After: ${parsed.url}`);
              needsUpdate = true;
              fixedCount++;
              return parsed.url;
            } catch (parseError) {
              console.log(`❌ Failed to parse corrupted image in product "${product.name}": ${img}`);
              return ''; // Remove corrupted image
            }
          }
          return img;
        }).filter(img => img !== ''); // Remove empty images
      }
      
      // Fix main image
      if (product.image && typeof product.image === 'string' && 
          product.image.startsWith('{') && product.image.includes('"url"')) {
        try {
          const parsed = JSON.parse(product.image);
          console.log(`🔧 Fixing corrupted main image in product "${product.name}"`);
          console.log(`   Before: ${product.image}`);
          console.log(`   After: ${parsed.url}`);
          updatedMainImage = parsed.url;
          needsUpdate = true;
          fixedCount++;
        } catch (parseError) {
          console.log(`❌ Failed to parse corrupted main image in product "${product.name}": ${product.image}`);
          updatedMainImage = ''; // Remove corrupted main image
          needsUpdate = true;
        }
      }
      
      // Update the product if needed
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            images: updatedImages,
            image: updatedMainImage,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`❌ Failed to update product "${product.name}":`, updateError);
        } else {
          console.log(`✅ Successfully updated product "${product.name}"`);
        }
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} corrupted image entries!`);
    console.log('\n💡 The admin panel should now display images correctly.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixCorruptedImages();
