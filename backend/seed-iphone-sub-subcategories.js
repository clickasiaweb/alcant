const SupabaseSubSubCategory = require('./models/SupabaseSubSubCategory');
const SupabaseSubCategory = require('./models/SupabaseSubCategory');

async function seedIPhoneSubSubCategories() {
  try {
    console.log('📱 Seeding iPhone Cases sub-subcategories...');

    // First, find the iPhone Cases subcategory
    const iPhoneCasesSubcategory = await SupabaseSubCategory.findOne({ slug: 'iphone-cases' });
    
    if (!iPhoneCasesSubcategory) {
      console.log('❌ iPhone Cases subcategory not found. Please create it first.');
      return;
    }

    console.log(`✅ Found iPhone Cases subcategory with ID: ${iPhoneCasesSubcategory.id}`);

    // iPhone cases sub-subcategories to add
    const iPhoneSubSubCategories = [
      { name: '17 Pro Case', slug: '17-pro-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: '16 Pro Case', slug: '16-pro-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: '15 Pro Case', slug: '15-pro-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: '14 Pro Case', slug: '14-pro-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: '13 Pro Case', slug: '13-pro-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: '12 Pro Case', slug: '12-pro-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: 'iPhone 15 Case', slug: 'iphone-15-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: 'iPhone 14 Case', slug: 'iphone-14-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: 'iPhone 13 Case', slug: 'iphone-13-case', subcategory_id: iPhoneCasesSubcategory.id },
      { name: 'iPhone 12 Case', slug: 'iphone-12-case', subcategory_id: iPhoneCasesSubcategory.id }
    ];

    // Check existing sub-subcategories
    const existingSubSubCategories = await SupabaseSubSubCategory.find({ 
      subcategory_id: iPhoneCasesSubcategory.id 
    });
    
    console.log(`📊 Found ${existingSubSubCategories.data?.length || 0} existing sub-subcategories`);

    // Add each sub-subcategory if it doesn't exist
    for (const subSubCategory of iPhoneSubSubCategories) {
      const existing = existingSubSubCategories.data?.find(
        existing => existing.slug === subSubCategory.slug
      );

      if (existing) {
        console.log(`⏭️  Skipping existing: ${subSubCategory.name}`);
        continue;
      }

      try {
        const result = await SupabaseSubSubCategory.create(subSubCategory);
        console.log(`✅ Created: ${subSubCategory.name} (ID: ${result.id})`);
      } catch (error) {
        console.log(`❌ Failed to create ${subSubCategory.name}:`, error.message);
      }
    }

    console.log('\n🎉 iPhone Cases sub-subcategories seeding completed!');
    
    // Verify the results
    const finalSubSubCategories = await SupabaseSubSubCategory.find({ 
      subcategory_id: iPhoneCasesSubcategory.id 
    });
    
    console.log(`📊 Total iPhone Cases sub-subcategories: ${finalSubSubCategories.data?.length || 0}`);
    console.log('📋 Sub-subcategories:');
    finalSubSubCategories.data?.forEach((subSub, index) => {
      console.log(`   ${index + 1}. ${subSub.name} (${subSub.slug})`);
    });

  } catch (error) {
    console.error('❌ Error seeding iPhone sub-subcategories:', error);
  }
}

// Run the seeding function
seedIPhoneSubSubCategories();
