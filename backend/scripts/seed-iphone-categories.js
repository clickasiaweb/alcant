const mongoose = require('mongoose');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const SubSubCategory = require('../models/SubSubCategory');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PRIMARY || process.env.MONGODB_URI_FALLBACK);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

const seedIPhoneCategories = async () => {
  try {
    await connectDB();

    // Clear existing iPhone-related categories
    await Category.deleteMany({ name: 'iPhone Cases' });
    await SubCategory.deleteMany({});
    await SubSubCategory.deleteMany({});

    console.log('🗑️ Cleared existing iPhone categories');

    // Create main category: iPhone Cases
    const iPhoneCategory = new Category({
      name: 'iPhone Cases',
      slug: 'iphone-cases',
      icon: 'smartphone',
      isActive: true
    });

    await iPhoneCategory.save();
    console.log('✅ Created main category: iPhone Cases');

    // Define the hierarchical structure
    const iPhoneHierarchy = {
      'iPhone 17': [
        'iPhone 17 Pro Max',
        'iPhone 17 Pro', 
        'iPhone 17 Air',
        'iPhone 17'
      ],
      'iPhone 16': [
        'iPhone 16 Pro Max',
        'iPhone 16 Pro',
        'iPhone 16 Plus', 
        'iPhone 16e',
        'iPhone 16'
      ],
      'iPhone 15': [
        'iPhone 15 Pro Max',
        'iPhone 15 Pro',
        'iPhone 15 Plus',
        'iPhone 15'
      ],
      'iPhone 14': [
        'iPhone 14 Pro Max',
        'iPhone 14 Pro',
        'iPhone 14 Plus',
        'iPhone 14'
      ],
      'iPhone 13': [
        'iPhone 13 Pro Max',
        'iPhone 13 Pro',
        'iPhone 13 Mini',
        'iPhone 13'
      ],
      'iPhone 12': [
        'iPhone 12 Pro Max',
        'iPhone 12 Pro',
        'iPhone 12 Mini',
        'iPhone 12'
      ]
    };

    // Create subcategories and sub-subcategories
    const subCategories = [];
    const subSubCategories = [];

    for (const [subCategoryName, subSubCategoryNames] of Object.entries(iPhoneHierarchy)) {
      // Create subcategory
      const subCategory = new SubCategory({
        name: subCategoryName,
        slug: generateSlug(subCategoryName),
        categoryId: iPhoneCategory._id,
        isActive: true
      });

      await subCategory.save();
      subCategories.push(subCategory);
      console.log(`✅ Created subcategory: ${subCategoryName}`);

      // Create sub-subcategories
      for (const subSubCategoryName of subSubCategoryNames) {
        const subSubCategory = new SubSubCategory({
          name: subSubCategoryName,
          slug: generateSlug(subSubCategoryName),
          subCategoryId: subCategory._id,
          isActive: true
        });

        await subSubCategory.save();
        subSubCategories.push(subSubCategory);
        console.log(`  ✅ Created sub-subcategory: ${subSubCategoryName}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`- Main Categories: 1 (iPhone Cases)`);
    console.log(`- Subcategories: ${subCategories.length}`);
    console.log(`- Sub-subcategories: ${subSubCategories.length}`);
    console.log('\n🎉 iPhone categories hierarchy created successfully!');

  } catch (error) {
    console.error('❌ Error seeding iPhone categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedIPhoneCategories();
