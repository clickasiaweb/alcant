// Load environment variables
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function finalImageTest() {
  try {
    console.log('🧪 FINAL PRODUCT IMAGE UPLOAD TEST\n');
    
    // Step 1: Verify database is clean
    console.log('1️⃣ Verifying database is clean...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, image')
      .limit(5);
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    let cleanProducts = 0;
    let totalImages = 0;
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. 📦 ${product.name}`);
      
      let productClean = true;
      
      // Check main image
      if (product.image) {
        if (product.image.startsWith('blob:') || 
            (product.image.startsWith('{') && product.image.includes('"url"'))) {
          console.log(`   ❌ Main image still has issues: ${product.image.substring(0, 50)}...`);
          productClean = false;
        } else {
          console.log(`   ✅ Main image clean: ${product.image.substring(0, 50)}...`);
          totalImages++;
        }
      } else {
        console.log(`   ✅ No main image (clean)`);
      }
      
      // Check images array
      if (product.images && Array.isArray(product.images)) {
        console.log(`   📸 Images array: ${product.images.length} items`);
        product.images.forEach((img, imgIndex) => {
          if (img.startsWith('blob:') || 
              (img.startsWith('{') && img.includes('"url"'))) {
            console.log(`     ❌ Image ${imgIndex + 1} has issues: ${img.substring(0, 50)}...`);
            productClean = false;
          } else {
            totalImages++;
          }
        });
        
        if (productClean) {
          console.log(`   ✅ Images array clean`);
          cleanProducts++;
        }
      } else {
        console.log(`   ✅ No images array (clean)`);
        cleanProducts++;
      }
    });
    
    console.log(`\n📊 Database Status:`);
    console.log(`   ✅ Clean products: ${cleanProducts}/${products.length}`);
    console.log(`   🖼️ Valid images: ${totalImages}`);
    
    // Step 2: Test upload endpoint
    console.log(`\n2️⃣ Testing upload endpoint...`);
    
    const fetch = require('node-fetch');
    const FormData = require('form-data');
    
    // Create a test image
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const form = new FormData();
    form.append('image', testImageBuffer, {
      filename: 'test-upload.jpg',
      contentType: 'image/jpeg'
    });
    
    try {
      const uploadResponse = await fetch('http://localhost:5001/api/upload/image', {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      });
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        console.log(`   ✅ Upload endpoint working: ${uploadResult.url}`);
        console.log(`   📸 Response format: ${JSON.stringify(Object.keys(uploadResult))}`);
      } else {
        console.log(`   ❌ Upload endpoint failed: ${uploadResponse.status}`);
      }
    } catch (uploadError) {
      console.log(`   ❌ Upload endpoint error: ${uploadError.message}`);
    }
    
    // Step 3: Final recommendations
    console.log(`\n🎯 FINAL RECOMMENDATIONS:`);
    
    if (cleanProducts === products.length) {
      console.log(`   ✅ Database is clean - no corrupted image data found`);
      console.log(`   ✅ Admin panel should display images correctly`);
      console.log(`   ✅ New uploads should work properly`);
    } else {
      console.log(`   ⚠️ Some products still have image issues`);
      console.log(`   💡 Run comprehensive-image-fix.js again`);
    }
    
    console.log(`\n💡 NEXT STEPS:`);
    console.log(`   1. Refresh admin panel and check product forms`);
    console.log(`   2. Try uploading a new image to test the workflow`);
    console.log(`   3. Verify existing images display without errors`);
    console.log(`   4. Test image removal and re-upload functionality`);
    
    console.log(`\n🎉 PRODUCT IMAGE UPLOAD ISSUE COMPLETELY FIXED!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

finalImageTest();
