// Load environment variables
require('dotenv').config();

const { supabase, supabaseService } = require('./config/supabase');

// Use service role for admin operations
const adminClient = supabaseService;

// Clear existing products and add fresh test data
async function clearAndAddTestData() {
  try {
    console.log('Clearing existing products...');

    // Delete all existing products
    const { error: deleteError } = await adminClient
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all products

    if (deleteError) {
      console.error('Error deleting products:', deleteError);
    } else {
      console.log('All existing products deleted successfully');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Adding fresh test products...');

    // Categories (already exist)
    const categoryIds = {
      'phone-cases': 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be',
      'wallets-cards': '883e60ba-b93d-4cb8-ab9e-680ac6bd6575',
      'accessories': '3db104e1-550d-435d-b74c-70a7d8066810',
      'car-travel': 'ebdcf9c0-ef1a-483d-a109-743d36ffdfe7'
    };

    // Fresh products to add
    const freshProducts = [
      // Phone Cases
      {
        name: 'Premium iPhone 15 Pro Case',
        slug: 'alcanside-iphone-15-pro-case',
        description: 'Luxury Alcantara case for iPhone 15 Pro with premium protection',
        price: 89.99,
        old_price: 119.99,
        final_price: 89.99,
        category: categoryIds['phone-cases'],
        subcategory: 'iphone-cases',
        rating: 5,
        reviews: 24,
        stock: 50,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      {
        name: 'Classic Samsung S24 Case',
        slug: 'alcanside-samsung-s24-case',
        description: 'Elegant Alcantara case for Samsung Galaxy S24',
        price: 79.99,
        old_price: 99.99,
        final_price: 79.99,
        category: categoryIds['phone-cases'],
        subcategory: 'samsung-cases',
        rating: 4,
        reviews: 18,
        stock: 30,
        is_new: false,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      {
        name: 'Google Pixel 8 Pro Case',
        slug: 'alcanside-pixel-8-pro-case',
        description: 'Premium Alcantara protection for Google Pixel 8 Pro',
        price: 84.99,
        old_price: null,
        final_price: 84.99,
        category: categoryIds['phone-cases'],
        subcategory: 'google-pixel-cases',
        rating: 4,
        reviews: 12,
        stock: 25,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      // Wallets & Cards
      {
        name: 'Executive Card Holder',
        slug: 'alcanside-executive-card-holder',
        description: 'Slim Alcantara card holder for business professionals',
        price: 49.99,
        old_price: 69.99,
        final_price: 49.99,
        category: categoryIds['wallets-cards'],
        subcategory: 'card-holders',
        rating: 5,
        reviews: 31,
        stock: 40,
        is_new: false,
        is_limited_edition: true,
        is_blue_monday_sale: false
      },
      {
        name: 'Premium Bifold Wallet',
        slug: 'alcanside-premium-bifold-wallet',
        description: 'Classic Alcantara bifold wallet with multiple card slots',
        price: 129.99,
        old_price: 159.99,
        final_price: 129.99,
        category: categoryIds['wallets-cards'],
        subcategory: 'full-wallets',
        rating: 5,
        reviews: 28,
        stock: 20,
        is_new: false,
        is_limited_edition: false,
        is_blue_monday_sale: true
      },
      {
        name: 'Compact Mini Wallet',
        slug: 'alcanside-compact-mini-wallet',
        description: 'Ultra-slim Alcantara mini wallet for minimal carry',
        price: 39.99,
        old_price: null,
        final_price: 39.99,
        category: categoryIds['wallets-cards'],
        subcategory: 'mini-wallets',
        rating: 4,
        reviews: 15,
        stock: 35,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      // Accessories
      {
        name: 'Luxury Apple Watch Band',
        slug: 'alcanside-apple-watch-band',
        description: 'Premium Alcantara band for Apple Watch Series 9',
        price: 69.99,
        old_price: 89.99,
        final_price: 69.99,
        category: categoryIds['accessories'],
        subcategory: 'watch-bands',
        rating: 5,
        reviews: 22,
        stock: 45,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      {
        name: 'Elegant Keychain Set',
        slug: 'alcanside-elegant-keychain-set',
        description: 'Set of 3 premium Alcantara keychains',
        price: 29.99,
        old_price: null,
        final_price: 29.99,
        category: categoryIds['accessories'],
        subcategory: 'keychains',
        rating: 4,
        reviews: 8,
        stock: 60,
        is_new: false,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      {
        name: 'Tech Organizer Pouch',
        slug: 'alcanside-tech-organizer-pouch',
        description: 'Alcantara pouch for cables and tech accessories',
        price: 34.99,
        old_price: 44.99,
        final_price: 34.99,
        category: categoryIds['accessories'],
        subcategory: 'tech-accessories',
        rating: 4,
        reviews: 11,
        stock: 55,
        is_new: false,
        is_limited_edition: false,
        is_blue_monday_sale: true
      },
      // Car & Travel
      {
        name: 'Premium Car Dashboard Cover',
        slug: 'alcanside-car-dashboard-cover',
        description: 'Luxury Alcantara dashboard cover for premium vehicles',
        price: 199.99,
        old_price: 249.99,
        final_price: 199.99,
        category: categoryIds['car-travel'],
        subcategory: 'car-accessories',
        rating: 5,
        reviews: 19,
        stock: 15,
        is_new: false,
        is_limited_edition: true,
        is_blue_monday_sale: false
      },
      {
        name: 'Travel Document Holder',
        slug: 'alcanside-travel-document-holder',
        description: 'Elegant Alcantara holder for passports and documents',
        price: 59.99,
        old_price: null,
        final_price: 59.99,
        category: categoryIds['car-travel'],
        subcategory: 'travel-essentials',
        rating: 4,
        reviews: 13,
        stock: 40,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false
      },
      {
        name: 'Luxury Travel Kit',
        slug: 'alcanside-luxury-travel-kit',
        description: 'Complete Alcantara travel accessories set',
        price: 149.99,
        old_price: 199.99,
        final_price: 149.99,
        category: categoryIds['car-travel'],
        subcategory: 'luxury-travel',
        rating: 5,
        reviews: 7,
        stock: 10,
        is_new: false,
        is_limited_edition: true,
        is_blue_monday_sale: true
      }
    ];

    // Add all fresh products
    for (const product of freshProducts) {
      const productData = {
        ...product,
        images: [],
        image: 'test-image.jpg',
        is_active: true
      };

      const { data, error } = await adminClient
        .from('products')
        .insert([productData])
        .select();
      
      if (error) {
        console.error('Error adding product:', error);
      } else {
        console.log('Added product:', product.name);
      }
    }

    console.log('Fresh test data added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

clearAndAddTestData();
