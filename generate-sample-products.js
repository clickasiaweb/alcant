const https = require('https');

// Helper function to make HTTPS requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function generateSampleProducts() {
  try {
    console.log('📋 Fetching categories...');
    const categoriesResponse = await makeRequest('https://alcant-backend.vercel.app/api/categories');
    
    let categories = [];
    if (typeof categoriesResponse === 'object' && categoriesResponse.categories) {
      categories = categoriesResponse.categories;
    } else {
      // Fallback categories based on the system
      categories = [
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Fashion', slug: 'fashion' },
        { name: 'Home & Living', slug: 'home-living' },
        { name: 'Accessories', slug: 'accessories' },
        { name: 'Sports', slug: 'sports' }
      ];
    }
    
    console.log(`✅ Found ${categories.length} categories`);
    
    // Generate 10 sample products
    const sampleProducts = [
      {
        product_name: 'Premium Alcantara Phone Case',
        slug: 'premium-alcantara-phone-case',
        description: 'Luxurious phone case made from genuine Alcantara material with premium protection and elegant feel',
        short_description: 'Premium Alcantara phone protection case',
        brand: 'Alcantara Premium',
        category: 'Accessories',
        sub_category: 'Phone Accessories',
        sub_sub_category: 'Phone Cases',
        price: 2999,
        sale_price: 2499,
        stock: 150,
        sku: 'ALC-PHONE-001-BLK',
        color: 'Black',
        size: 'Universal',
        weight: 50,
        image_1: 'https://example.com/alcantara-phone-case-1.jpg',
        image_2: 'https://example.com/alcantara-phone-case-2.jpg',
        image_3: 'https://example.com/alcantara-phone-case-3.jpg',
        image_4: 'https://example.com/alcantara-phone-case-4.jpg'
      },
      {
        product_name: 'Alcantara Laptop Sleeve 15"',
        slug: 'alcantara-laptop-sleeve-15',
        description: 'Professional laptop sleeve designed for 15-inch laptops, featuring premium Alcantara exterior with soft interior lining',
        short_description: '15" Alcantara laptop protection sleeve',
        brand: 'Alcantara Pro',
        category: 'Accessories',
        sub_category: 'Computer Accessories',
        sub_sub_category: 'Laptop Bags',
        price: 4999,
        sale_price: 3999,
        stock: 75,
        sku: 'ALC-LAP-015-NAV',
        color: 'Navy',
        size: '15 inch',
        weight: 300,
        image_1: 'https://example.com/laptop-sleeve-1.jpg',
        image_2: 'https://example.com/laptop-sleeve-2.jpg',
        image_3: 'https://example.com/laptop-sleeve-3.jpg',
        image_4: 'https://example.com/laptop-sleeve-4.jpg'
      },
      {
        product_name: 'Alcantara Car Seat Covers Set',
        slug: 'alcantara-car-seat-covers-set',
        description: 'Complete set of luxury car seat covers made from premium Alcantara material, fits most standard car models',
        short_description: 'Premium Alcantara car seat covers set',
        brand: 'AutoAlcantara',
        category: 'Automotive',
        sub_category: 'Car Interior',
        sub_sub_category: 'Seat Covers',
        price: 15999,
        sale_price: 12999,
        stock: 25,
        sku: 'ALC-CAR-001-RED',
        color: 'Red',
        size: 'Standard',
        weight: 2000,
        image_1: 'https://example.com/car-seat-covers-1.jpg',
        image_2: 'https://example.com/car-seat-covers-2.jpg',
        image_3: 'https://example.com/car-seat-covers-3.jpg',
        image_4: 'https://example.com/car-seat-covers-4.jpg'
      },
      {
        product_name: 'Alcantara Watch Strap',
        slug: 'alcantara-watch-strap',
        description: 'Elegant watch strap crafted from genuine Alcantara, compatible with most luxury watch brands',
        short_description: 'Premium Alcantara watch strap',
        brand: 'Alcantara Time',
        category: 'Accessories',
        sub_category: 'Watches',
        sub_sub_category: 'Watch Straps',
        price: 3999,
        sale_price: 3499,
        stock: 200,
        sku: 'ALC-WATCH-001-BRN',
        color: 'Brown',
        size: '22mm',
        weight: 20,
        image_1: 'https://example.com/watch-strap-1.jpg',
        image_2: 'https://example.com/watch-strap-2.jpg',
        image_3: 'https://example.com/watch-strap-3.jpg',
        image_4: 'https://example.com/watch-strap-4.jpg'
      },
      {
        product_name: 'Alcantara Gaming Mouse Pad',
        slug: 'alcantara-gaming-mouse-pad',
        description: 'Professional gaming mouse pad with Alcantara surface for optimal mouse tracking and comfort',
        short_description: 'Gaming mouse pad with Alcantara surface',
        brand: 'Alcantara Gaming',
        category: 'Electronics',
        sub_category: 'Gaming',
        sub_sub_category: 'Mouse Pads',
        price: 1999,
        sale_price: 1499,
        stock: 100,
        sku: 'ALC-GAME-001-BLK',
        color: 'Black',
        size: 'Large',
        weight: 150,
        image_1: 'https://example.com/mouse-pad-1.jpg',
        image_2: 'https://example.com/mouse-pad-2.jpg',
        image_3: 'https://example.com/mouse-pad-3.jpg',
        image_4: 'https://example.com/mouse-pad-4.jpg'
      },
      {
        product_name: 'Alcantara Journal Notebook',
        slug: 'alcantara-journal-notebook',
        description: 'Luxury journal notebook with Alcantara cover and premium paper, perfect for professionals',
        short_description: 'Premium Alcantara covered journal',
        brand: 'Alcantara Stationery',
        category: 'Stationery',
        sub_category: 'Notebooks',
        sub_sub_category: 'Journals',
        price: 2499,
        sale_price: 1999,
        stock: 80,
        sku: 'ALC-JOURNAL-001-TAN',
        color: 'Tan',
        size: 'A5',
        weight: 400,
        image_1: 'https://example.com/journal-1.jpg',
        image_2: 'https://example.com/journal-2.jpg',
        image_3: 'https://example.com/journal-3.jpg',
        image_4: 'https://example.com/journal-4.jpg'
      },
      {
        product_name: 'Alcantara Yoga Mat',
        slug: 'alcantara-yoga-mat',
        description: 'Premium yoga mat with Alcantara surface for superior grip and comfort during practice',
        short_description: 'Luxury Alcantara yoga mat',
        brand: 'Alcantara Fitness',
        category: 'Sports',
        sub_category: 'Yoga',
        sub_sub_category: 'Yoga Mats',
        price: 6999,
        sale_price: 5499,
        stock: 60,
        sku: 'ALC-YOGA-001-GRY',
        color: 'Grey',
        size: '183cm x 61cm',
        weight: 1200,
        image_1: 'https://example.com/yoga-mat-1.jpg',
        image_2: 'https://example.com/yoga-mat-2.jpg',
        image_3: 'https://example.com/yoga-mat-3.jpg',
        image_4: 'https://example.com/yoga-mat-4.jpg'
      },
      {
        product_name: 'Alcantara Travel Pillow',
        slug: 'alcantara-travel-pillow',
        description: 'Ergonomic travel pillow with Alcantara cover for maximum comfort during long journeys',
        short_description: 'Luxury travel pillow with Alcantara cover',
        brand: 'Alcantara Travel',
        category: 'Travel',
        sub_category: 'Travel Accessories',
        sub_sub_category: 'Pillows',
        price: 3499,
        sale_price: 2799,
        stock: 120,
        sku: 'ALC-TRAVEL-001-NAV',
        color: 'Navy',
        size: 'Standard',
        weight: 300,
        image_1: 'https://example.com/travel-pillow-1.jpg',
        image_2: 'https://example.com/travel-pillow-2.jpg',
        image_3: 'https://example.com/travel-pillow-3.jpg',
        image_4: 'https://example.com/travel-pillow-4.jpg'
      },
      {
        product_name: 'Alcantara Desk Organizer',
        slug: 'alcantara-desk-organizer',
        description: 'Elegant desk organizer with Alcantara finish, perfect for modern office setups',
        short_description: 'Premium Alcantara desk organizer',
        brand: 'Alcantara Office',
        category: 'Home & Living',
        sub_category: 'Office',
        sub_sub_category: 'Desk Accessories',
        price: 4499,
        sale_price: 3499,
        stock: 90,
        sku: 'ALC-DESK-001-BLK',
        color: 'Black',
        size: '30cm x 20cm',
        weight: 800,
        image_1: 'https://example.com/desk-organizer-1.jpg',
        image_2: 'https://example.com/desk-organizer-2.jpg',
        image_3: 'https://example.com/desk-organizer-3.jpg',
        image_4: 'https://example.com/desk-organizer-4.jpg'
      },
      {
        product_name: 'Alcantara Pet Bed',
        slug: 'alcantara-pet-bed',
        description: 'Luxury pet bed with Alcantara sleeping surface, providing ultimate comfort for your pets',
        short_description: 'Premium Alcantara pet bed',
        brand: 'Alcantara Pets',
        category: 'Pet Supplies',
        sub_category: 'Dog Supplies',
        sub_sub_category: 'Beds',
        price: 8999,
        sale_price: 6999,
        stock: 40,
        sku: 'ALC-PET-001-GRY',
        color: 'Grey',
        size: 'Large',
        weight: 1500,
        image_1: 'https://example.com/pet-bed-1.jpg',
        image_2: 'https://example.com/pet-bed-2.jpg',
        image_3: 'https://example.com/pet-bed-3.jpg',
        image_4: 'https://example.com/pet-bed-4.jpg'
      }
    ];

    // Generate CSV content
    const headers = [
      'product_name',
      'slug', 
      'description',
      'short_description',
      'brand',
      'category',
      'sub_category',
      'sub_sub_category',
      'price',
      'sale_price',
      'stock',
      'sku',
      'color',
      'size',
      'weight',
      'image_1',
      'image_2',
      'image_3',
      'image_4'
    ];

    const csvContent = [
      headers.join(','),
      ...sampleProducts.map(product => [
        `"${product.product_name}"`,
        `"${product.slug}"`,
        `"${product.description}"`,
        `"${product.short_description}"`,
        `"${product.brand}"`,
        `"${product.category}"`,
        `"${product.sub_category}"`,
        `"${product.sub_sub_category}"`,
        product.price,
        product.sale_price,
        product.stock,
        `"${product.sku}"`,
        `"${product.color}"`,
        `"${product.size}"`,
        product.weight,
        `"${product.image_1}"`,
        `"${product.image_2}"`,
        `"${product.image_3}"`,
        `"${product.image_4}"`
      ].join(','))
    ].join('\n');

    // Save CSV file
    const fs = require('fs');
    fs.writeFileSync('sample-products.csv', csvContent);
    
    console.log('✅ Generated sample-products.csv with 10 products');
    console.log('📊 Products created:');
    sampleProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.product_name} - ${product.category}`);
    });

  } catch (error) {
    console.error('❌ Error generating sample products:', error.message);
  }
}

generateSampleProducts();
