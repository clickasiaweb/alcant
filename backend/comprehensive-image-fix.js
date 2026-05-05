// Load environment variables
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service key for write operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

async function comprehensiveImageFix() {
  try {
    console.log('🔧 COMPREHENSIVE PRODUCT IMAGE FIX\n');
    
    // Step 1: Check current state
    console.log('1️⃣ Checking current product image state...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, image')
      .limit(10);
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    console.log(`📦 Found ${products.length} products to analyze\n`);
    
    let totalIssues = 0;
    let fixedIssues = 0;
    
    // Step 2: Analyze and fix each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`${i + 1}. 📦 Product: ${product.name}`);
      
      let needsUpdate = false;
      let updatedImages = [...(product.images || [])];
      let updatedMainImage = product.image;
      
      // Fix images array
      if (product.images && Array.isArray(product.images)) {
        console.log(`   📸 Images array (${product.images.length} items):`);
        
        updatedImages = product.images.map((img, index) => {
          let fixedImage = img;
          
          // Issue 1: Corrupted JSON string data
          if (typeof img === 'string' && img.startsWith('{') && img.includes('"url"')) {
            try {
              const parsed = JSON.parse(img);
              console.log(`     🔧 Fixing corrupted JSON (item ${index + 1})`);
              console.log(`        Before: ${img.substring(0, 50)}...`);
              console.log(`        After: ${parsed.url}`);
              fixedImage = parsed.url;
              needsUpdate = true;
              totalIssues++;
              fixedIssues++;
            } catch (parseError) {
              console.log(`     ❌ Removing corrupted JSON (item ${index + 1})`);
              fixedImage = ''; // Remove corrupted image
              needsUpdate = true;
              totalIssues++;
            }
          }
          
          // Issue 2: Invalid/expired blob URLs
          if (fixedImage && fixedImage.startsWith('blob:')) {
            console.log(`     ⚠️ Removing expired blob URL (item ${index + 1})`);
            console.log(`        URL: ${fixedImage.substring(0, 50)}...`);
            fixedImage = ''; // Remove blob URLs
            needsUpdate = true;
            totalIssues++;
          }
          
          // Issue 3: Invalid URLs
          if (fixedImage && typeof fixedImage === 'string') {
            if (!fixedImage.startsWith('http') && !fixedImage.startsWith('data:') && 
                !fixedImage.startsWith('/uploads/') && fixedImage !== '') {
              console.log(`     ⚠️ Removing invalid URL (item ${index + 1})`);
              console.log(`        URL: ${fixedImage}`);
              fixedImage = ''; // Remove invalid URLs
              needsUpdate = true;
              totalIssues++;
            }
          }
          
          return fixedImage;
        }).filter(img => img !== ''); // Remove empty images
        
        console.log(`     ✅ Cleaned images array: ${updatedImages.length} items`);
      }
      
      // Fix main image
      if (product.image) {
        console.log(`   🖼️ Main image: ${product.image}`);
        
        let fixedMainImage = product.image;
        
        // Issue 1: Corrupted JSON string data
        if (typeof product.image === 'string' && product.image.startsWith('{') && product.image.includes('"url"')) {
          try {
            const parsed = JSON.parse(product.image);
            console.log(`     🔧 Fixing corrupted main image JSON`);
            console.log(`        Before: ${product.image.substring(0, 50)}...`);
            console.log(`        After: ${parsed.url}`);
            fixedMainImage = parsed.url;
            needsUpdate = true;
            totalIssues++;
            fixedIssues++;
          } catch (parseError) {
            console.log(`     ❌ Removing corrupted main image JSON`);
            fixedMainImage = ''; // Remove corrupted main image
            needsUpdate = true;
            totalIssues++;
          }
        }
        
        // Issue 2: Invalid/expired blob URLs
        if (fixedMainImage && fixedMainImage.startsWith('blob:')) {
          console.log(`     ⚠️ Removing expired blob main image`);
          console.log(`        URL: ${fixedMainImage.substring(0, 50)}...`);
          fixedMainImage = ''; // Remove blob URLs
          needsUpdate = true;
          totalIssues++;
        }
        
        // Issue 3: Invalid URLs
        if (fixedMainImage && typeof fixedMainImage === 'string') {
          if (!fixedMainImage.startsWith('http') && !fixedMainImage.startsWith('data:') && 
              !fixedMainImage.startsWith('/uploads/') && fixedMainImage !== '') {
            console.log(`     ⚠️ Removing invalid main image URL`);
            console.log(`        URL: ${fixedMainImage}`);
            fixedMainImage = ''; // Remove invalid URLs
            needsUpdate = true;
            totalIssues++;
          }
        }
        
        updatedMainImage = fixedMainImage;
        console.log(`     ✅ Cleaned main image: ${updatedMainImage || 'None'}`);
      }
      
      // Update the product if needed
      if (needsUpdate) {
        console.log(`     💾 Updating product in database...`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({
            images: updatedImages,
            image: updatedMainImage,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`     ❌ Failed to update:`, updateError.message);
        } else {
          console.log(`     ✅ Successfully updated!`);
        }
      } else {
        console.log(`     ✅ No issues found`);
      }
      
      console.log('');
    }
    
    // Step 3: Summary
    console.log('🎉 COMPREHENSIVE FIX SUMMARY:');
    console.log(`   📊 Total issues found: ${totalIssues}`);
    console.log(`   ✅ Issues fixed: ${fixedIssues}`);
    console.log(`   📦 Products processed: ${products.length}`);
    
    if (totalIssues > 0) {
      console.log('\n💡 NEXT STEPS:');
      console.log('1. Refresh the admin panel');
      console.log('2. Check product forms - Image Error placeholders should be gone');
      console.log('3. Upload new images to test the workflow');
      console.log('4. Verify existing images display correctly');
    } else {
      console.log('\n✅ No issues found - product images are clean!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

comprehensiveImageFix();
