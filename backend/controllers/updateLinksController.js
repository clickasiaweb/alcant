const SupabaseSubSubCategory = require('../models/SupabaseSubSubCategory');

// POST /api/update/iphone-links
exports.updateIPhoneLinks = async (req, res) => {
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
      return res.status(404).json({ 
        error: 'No iPhone cases found to update' 
      });
    }

    console.log(`📱 Found ${iphoneCases.length} iPhone cases to update`);

    const results = [];
    const errors = [];

    for (const iphoneCase of iphoneCases) {
      try {
        // Update with auto link type (will generate proper category URLs)
        const updated = await SupabaseSubSubCategory.findByIdAndUpdate(iphoneCase.id, {
          link_type: 'auto',
          custom_url: null
        });
        
        results.push({ name: iphoneCase.name, id: iphoneCase.id });
        console.log(`✅ Updated: ${iphoneCase.name} -> auto-generated category link`);
      } catch (error) {
        errors.push({ name: iphoneCase.name, error: error.message });
        console.log(`❌ Failed to update ${iphoneCase.name}:`, error.message);
      }
    }

    console.log('\n🎉 iPhone cases link configuration update completed!');

    res.json({
      success: true,
      message: 'iPhone cases link configuration update completed',
      results: {
        updated: results.length,
        errors: errors.length,
        total: iphoneCases.length
      },
      updated: results,
      errors: errors
    });

  } catch (error) {
    console.error('❌ Error updating iPhone cases:', error);
    res.status(500).json({ 
      error: 'Failed to update iPhone cases link configuration', 
      details: error.message 
    });
  }
};
