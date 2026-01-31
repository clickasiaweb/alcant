const mongoose = require('mongoose');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
require('dotenv').config();

const seedCategories = async () => {
  try {
    // Clear existing categories and subcategories
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    console.log('Cleared existing categories and subcategories');

    // Define categories with their subcategories
    const categoriesData = [
      {
        name: 'Phone Cases',
        slug: 'phone-cases',
        icon: '📱',
        isActive: true,
        subcategories: [
          { name: 'iPhone Cases', slug: 'iphone-cases' },
          { name: 'Samsung Cases', slug: 'samsung-cases' },
          { name: 'Google Cases', slug: 'google-cases' },
          { name: 'OnePlus Cases', slug: 'oneplus-cases' },
          { name: 'Huawei Cases', slug: 'huawei-cases' },
          { name: 'Premium Cases', slug: 'premium-cases' }
        ]
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        icon: '🎧',
        isActive: true,
        subcategories: [
          { name: 'Screen Protectors', slug: 'screen-protectors' },
          { name: 'Charging Cables', slug: 'charging-cables' },
          { name: 'Wireless Chargers', slug: 'wireless-chargers' },
          { name: 'Car Mounts', slug: 'car-mounts' },
          { name: 'Pop Sockets', slug: 'pop-sockets' },
          { name: 'Ring Lights', slug: 'ring-lights' }
        ]
      },
      {
        name: 'Wallets',
        slug: 'wallets',
        icon: '👛',
        isActive: true,
        subcategories: [
          { name: 'Leather Wallets', slug: 'leather-wallets' },
          { name: 'Card Holders', slug: 'card-holders' },
          { name: 'Coin Purses', slug: 'coin-purses' },
          { name: 'Passport Holders', slug: 'passport-holders' },
          { name: 'Travel Wallets', slug: 'travel-wallets' },
          { name: 'RFID Wallets', slug: 'rfid-wallets' }
        ]
      },
      {
        name: 'Office',
        slug: 'office',
        icon: '💼',
        isActive: true,
        subcategories: [
          { name: 'Desk Organizers', slug: 'desk-organizers' },
          { name: 'Cable Management', slug: 'cable-management' },
          { name: 'Mouse Pads', slug: 'mouse-pads' },
          { name: 'Laptop Stands', slug: 'laptop-stands' },
          { name: 'Phone Stands', slug: 'phone-stands' },
          { name: 'Business Card Holders', slug: 'business-card-holders' }
        ]
      },
      {
        name: 'Car & Travel',
        slug: 'car-travel',
        icon: '🚗',
        isActive: true,
        subcategories: [
          { name: 'Car Organizers', slug: 'car-organizers' },
          { name: 'Travel Pouches', slug: 'travel-pouches' },
          { name: 'Phone Holders', slug: 'phone-holders' },
          { name: 'Cable Organizers', slug: 'cable-organizers' },
          { name: 'Seat Gap Fillers', slug: 'seat-gap-fillers' },
          { name: 'Dashboard Mats', slug: 'dashboard-mats' }
        ]
      },
      {
        name: 'Sale',
        slug: 'sale',
        icon: '🏷️',
        isActive: true,
        subcategories: [
          { name: 'Clearance Items', slug: 'clearance-items' },
          { name: 'Seasonal Deals', slug: 'seasonal-deals' },
          { name: 'Bundle Offers', slug: 'bundle-offers' },
          { name: 'Last Chance', slug: 'last-chance' },
          { name: 'Outlet', slug: 'outlet' },
          { name: 'Flash Sale', slug: 'flash-sale' }
        ]
      }
    ];

    // Create categories and subcategories
    for (const categoryData of categoriesData) {
      const { subcategories, ...categoryInfo } = categoryData;
      
      // Create category
      const category = await Category.create(categoryInfo);
      console.log(`✓ Created category: ${category.name}`);

      // Create subcategories
      for (const subcategoryData of subcategories) {
        await SubCategory.create({
          ...subcategoryData,
          categoryId: category._id,
          isActive: true
        });
        console.log(`  ✓ Created subcategory: ${subcategoryData.name}`);
      }
    }

    console.log('\n✅ Successfully seeded categories and subcategories!');
    
    // Display summary
    const totalCategories = await Category.countDocuments();
    const totalSubcategories = await SubCategory.countDocuments();
    console.log(`📊 Summary: ${totalCategories} categories and ${totalSubcategories} subcategories created`);
    
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seed function
seedCategories().then(() => {
  console.log('Seeding completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
