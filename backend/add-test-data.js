// Load environment variables
require('dotenv').config();

const { supabase, supabaseService } = require('./config/supabase');

// Use service role for admin operations
const adminClient = supabaseService;

// Add test categories, subcategories, and products
async function addTestData() {
  try {
    console.log('Adding test categories, subcategories, and products...');

    // Categories to add
    const categories = [
      {
        name: 'Phone Cases',
        slug: 'phone-cases',
        description: 'Premium Alcantara phone cases for all devices',
        image: null,
        is_active: true
      },
      {
        name: 'Wallets & Cards',
        slug: 'wallets-cards',
        description: 'Elegant Alcantara wallets and card holders',
        image: null,
        is_active: true
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Premium Alcantara accessories for your lifestyle',
        image: null,
        is_active: true
      },
      {
        name: 'Car & Travel',
        slug: 'car-travel',
        description: 'Alcantara accessories for car and travel',
        image: null,
        is_active: true
      }
    ];

    // Add categories
    const categoryIds = {};
    for (const category of categories) {
      // First try to find existing category
      const { data: existingCategories, error: checkError } = await adminClient
        .from('categories')
        .select('*')
        .eq('slug', category.slug);
      
      if (checkError) {
        console.error('Error checking category:', checkError);
        continue;
      }
      
      if (existingCategories && existingCategories.length > 0) {
        console.log('Category already exists:', category.name);
        categoryIds[category.slug] = existingCategories[0].id;
      } else {
        // Add new category
        const { data, error } = await adminClient
          .from('categories')
          .insert([category])
          .select();
        
        if (error) {
          console.error('Error adding category:', error);
        } else {
          console.log('Added category:', category.name);
          categoryIds[category.slug] = data[0].id;
        }
      }
    }

    console.log('Category IDs:', categoryIds);

    // Wait a moment for categories to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Subcategories and products to add
    const subcategoriesAndProducts = [
      {
        categorySlug: 'phone-cases',
        subcategories: [
          { name: 'iPhone Cases', slug: 'iphone-cases' },
          { name: 'Samsung Cases', slug: 'samsung-cases' },
          { name: 'Google Pixel Cases', slug: 'google-pixel-cases' }
        ],
        products: [
          {
            name: 'Premium iPhone 15 Pro Case',
            slug: 'alcanside-iphone-15-pro-case',
            description: 'Luxury Alcantara case for iPhone 15 Pro with premium protection',
            price: 89.99,
            old_price: 119.99,
            final_price: 89.99,
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
            subcategory: 'google-pixel-cases',
            rating: 4,
            reviews: 12,
            stock: 25,
            is_new: true,
            is_limited_edition: false,
            is_blue_monday_sale: false
          }
        ]
      },
      {
        categorySlug: 'wallets-cards',
        subcategories: [
          { name: 'Card Holders', slug: 'card-holders' },
          { name: 'Full Wallets', slug: 'full-wallets' },
          { name: 'Mini Wallets', slug: 'mini-wallets' }
        ],
        products: [
          {
            name: 'Executive Card Holder',
            slug: 'alcanside-executive-card-holder',
            description: 'Slim Alcantara card holder for business professionals',
            price: 49.99,
            old_price: 69.99,
            final_price: 49.99,
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
            subcategory: 'mini-wallets',
            rating: 4,
            reviews: 15,
            stock: 35,
            is_new: true,
            is_limited_edition: false,
            is_blue_monday_sale: false
          }
        ]
      },
      {
        categorySlug: 'accessories',
        subcategories: [
          { name: 'Watch Bands', slug: 'watch-bands' },
          { name: 'Keychains', slug: 'keychains' },
          { name: 'Tech Accessories', slug: 'tech-accessories' }
        ],
        products: [
          {
            name: 'Luxury Apple Watch Band',
            slug: 'alcanside-apple-watch-band',
            description: 'Premium Alcantara band for Apple Watch Series 9',
            price: 69.99,
            old_price: 89.99,
            final_price: 69.99,
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
            subcategory: 'tech-accessories',
            rating: 4,
            reviews: 11,
            stock: 55,
            is_new: false,
            is_limited_edition: false,
            is_blue_monday_sale: true
          }
        ]
      },
      {
        categorySlug: 'car-travel',
        subcategories: [
          { name: 'Car Accessories', slug: 'car-accessories' },
          { name: 'Travel Essentials', slug: 'travel-essentials' },
          { name: 'Luxury Travel', slug: 'luxury-travel' }
        ],
        products: [
          {
            name: 'Premium Car Dashboard Cover',
            slug: 'alcanside-car-dashboard-cover',
            description: 'Luxury Alcantara dashboard cover for premium vehicles',
            price: 199.99,
            old_price: 249.99,
            final_price: 199.99,
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
            subcategory: 'luxury-travel',
            rating: 5,
            reviews: 7,
            stock: 10,
            is_new: false,
            is_limited_edition: true,
            is_blue_monday_sale: true
          }
        ]
      }
    ];

    // Add products for each category
    for (const categoryData of subcategoriesAndProducts) {
      const categoryId = categoryIds[categoryData.categorySlug];
      if (!categoryId) {
        console.log('Category not found:', categoryData.categorySlug);
        continue;
      }

      console.log(`Adding products for ${categoryData.categorySlug}...`);

      for (const product of categoryData.products) {
        const { data: existingProduct, error: checkError } = await adminClient
          .from('products')
          .select('*')
          .eq('slug', product.slug)
          .single();
        
        if (!existingProduct && !checkError) {
          const productData = {
            ...product,
            category: categoryId, // Use category field for Supabase
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
        } else {
          console.log('Product already exists:', product.name);
        }
      }
    }

    console.log('Test data added successfully!');
    
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

addTestData();
