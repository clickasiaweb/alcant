const SupabaseSubSubCategory = require('./models/SupabaseSubSubCategory');

async function updateIPhoneLinks() {
  try {
    console.log('🔄 Updating iPhone cases sub-subcategories with link configurations...');

    // Get all iPhone cases sub-subcategories
    const iphoneSubSubCategories = await SupabaseSubSubCategory.find({ is_active: true });
    const iphoneCases = iphoneSubSubCategories.data?.filter(subSub => 
      subSub.name.includes('iPhone') || 
      subSub.name.includes('Pro Case') ||
      subSub.slug.includes('iphone') ||
      subSub.slug.includes('-case')
    );

    if (!iphoneCases || iphoneCases.length === 0) {
      console.log('❌ No iPhone cases found to update');
      return;
    }

    console.log(`📱 Found ${iphoneCases.length} iPhone cases to update`);

    for (const iphoneCase of iphoneCases) {
      try {
        // Update with auto link type (will generate proper category URLs)
        const updated = await SupabaseSubSubCategory.findByIdAndUpdate(iphoneCase.id, {
          link_type: 'auto',
          custom_url: null
        });
        
        console.log(`✅ Updated: ${iphoneCase.name} -> auto-generated category link`);
      } catch (error) {
        console.log(`❌ Failed to update ${iphoneCase.name}:`, error.message);
      }
    }

    console.log('\n🎉 iPhone cases link configuration update completed!');
    
    // Verify the updates
    const updatedCases = await SupabaseSubSubCategory.find({ is_active: true });
    const finalIPhoneCases = updatedCases.data?.filter(subSub => 
      subSub.name.includes('iPhone') || 
      subSub.name.includes('Pro Case') ||
      subSub.slug.includes('iphone') ||
      subSub.slug.includes('-case')
    );

    console.log(`📊 Total iPhone cases with link config: ${finalIPhoneCases?.length || 0}`);
    console.log('📋 Updated iPhone cases:');
    finalIPhoneCases?.forEach((iphoneCase, index) => {
      console.log(`   ${index + 1}. ${iphoneCase.name} (${iphoneCase.link_type})`);
    });

  } catch (error) {
    console.error('❌ Error updating iPhone cases:', error);
  }
}

// Run the update function
updateIPhoneLinks();
