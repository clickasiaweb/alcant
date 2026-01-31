const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const alcansideProducts = [
  // Phone Cases - iPhone Cases
  {
    name: 'iPhone 15 Pro Alcantara Case - Space Gray',
    description: 'Premium Alcantara case for iPhone 15 Pro in elegant Space Gray color',
    price: 3500,
    oldPrice: 4000,
    category: 'phone-cases',
    subcategory: 'iphone-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 211,
    stock: 50,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  {
    name: 'iPhone 15 Pro Alcantara Case - Orange',
    description: 'Vibrant Orange Alcantara case for iPhone 15 Pro with premium finish',
    price: 3500,
    oldPrice: 4000,
    category: 'phone-cases',
    subcategory: 'iphone-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 180,
    stock: 30,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  {
    name: 'iPhone 15 Pro Alcantara Case - Dream Blue',
    description: 'Dream Blue Alcantara case for iPhone 15 Pro - Blue Monday Special',
    price: 2600,
    oldPrice: 3000,
    category: 'phone-cases',
    subcategory: 'iphone-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 230,
    stock: 25,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  
  // Phone Cases - Samsung Cases
  {
    name: 'Samsung S24 Alcantara Case - Navy Blue',
    description: 'Premium Navy Blue Alcantara case for Samsung S24 - Limited Edition',
    price: 3900,
    oldPrice: 4500,
    category: 'phone-cases',
    subcategory: 'samsung-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 195,
    stock: 15,
    isNew: false,
    isLimitedEdition: true,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Phone Cases - Google Cases
  {
    name: 'Google Pixel 8 Alcantara Case - Midnight Green',
    description: 'Elegant Midnight Green Alcantara case for Google Pixel 8',
    price: 3500,
    oldPrice: 4000,
    category: 'phone-cases',
    subcategory: 'google-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 167,
    stock: 35,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Phone Cases - OnePlus Cases
  {
    name: 'OnePlus 12 Alcantara Case - Wine Red',
    description: 'Rich Wine Red Alcantara case for OnePlus 12 with premium texture',
    price: 3500,
    oldPrice: 4000,
    category: 'phone-cases',
    subcategory: 'oneplus-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 189,
    stock: 40,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Phone Cases - Huawei Cases
  {
    name: 'Huawei P60 Alcantara Case - Chocolate Brown',
    description: 'Warm Chocolate Brown Alcantara case for Huawei P60',
    price: 3500,
    oldPrice: 4000,
    category: 'phone-cases',
    subcategory: 'huawei-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 156,
    stock: 20,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Phone Cases - Premium Cases
  {
    name: 'iPhone 15 Pro Premium Alcantara Case - Limited Edition',
    description: 'Ultra-premium Limited Edition Alcantara case for iPhone 15 Pro',
    price: 5500,
    oldPrice: null,
    category: 'phone-cases',
    subcategory: 'premium-cases',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 298,
    stock: 10,
    isNew: false,
    isLimitedEdition: true,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Accessories - Screen Protectors
  {
    name: 'iPhone 15 Pro Alcantara Screen Protector - Ultra Clear',
    description: 'Ultra Clear Alcantara Screen Protector for iPhone 15 Pro',
    price: 1200,
    oldPrice: 1500,
    category: 'accessories',
    subcategory: 'screen-protectors',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 189,
    stock: 100,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  {
    name: 'iPhone 15 Pro Alcantara Screen Protector - Matte Finish',
    description: 'Matte Finish Alcantara Screen Protector for iPhone 15 Pro',
    price: 1300,
    oldPrice: 1600,
    category: 'accessories',
    subcategory: 'screen-protectors',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 145,
    stock: 80,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  {
    name: 'Samsung S24 Alcantara Screen Protector - Ultra Clear',
    description: 'Ultra Clear Alcantara Screen Protector for Samsung S24',
    price: 1100,
    oldPrice: 1400,
    category: 'accessories',
    subcategory: 'screen-protectors',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 167,
    stock: 90,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  
  // Accessories - Charging Cables
  {
    name: 'USB-C to Lightning Alcantara Cable - 2m - Black',
    description: 'Premium 2m USB-C to Lightning Alcantara Cable in Black',
    price: 1800,
    oldPrice: null,
    category: 'accessories',
    subcategory: 'charging-cables',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 234,
    stock: 60,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  {
    name: 'USB-C to USB-C Alcantara Cable - 2m - Navy Blue',
    description: 'Premium 2m USB-C to USB-C Alcantara Cable in Navy Blue',
    price: 1600,
    oldPrice: 2000,
    category: 'accessories',
    subcategory: 'charging-cables',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 189,
    stock: 70,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  
  // Accessories - Wireless Chargers
  {
    name: 'Alcantara Wireless Charging Pad - Space Gray',
    description: 'Elegant Space Gray Alcantara Wireless Charging Pad',
    price: 3500,
    oldPrice: 4000,
    category: 'accessories',
    subcategory: 'wireless-chargers',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 298,
    stock: 45,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  {
    name: 'Alcantara Wireless Charging Stand - Black',
    description: 'Premium Black Alcantara Wireless Charging Stand',
    price: 4200,
    oldPrice: null,
    category: 'accessories',
    subcategory: 'wireless-chargers',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 167,
    stock: 25,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Accessories - Car Mounts
  {
    name: 'Alcantara Car Mount - Dashboard - Black',
    description: 'Premium Dashboard Car Mount with Black Alcantara finish',
    price: 2800,
    oldPrice: null,
    category: 'accessories',
    subcategory: 'car-mounts',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 145,
    stock: 30,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Accessories - Pop Sockets
  {
    name: 'Alcantara Pop Socket - Space Gray',
    description: 'Stylish Space Gray Alcantara Pop Socket',
    price: 800,
    oldPrice: 1000,
    category: 'accessories',
    subcategory: 'pop-sockets',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 178,
    stock: 150,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  
  // Accessories - Ring Lights
  {
    name: 'Alcantara Ring Light - Clip On - Black',
    description: 'Premium Black Alcantara Clip-On Ring Light',
    price: 1500,
    oldPrice: null,
    category: 'accessories',
    subcategory: 'ring-lights',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 123,
    stock: 40,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Wallets - Leather Wallets
  {
    name: 'Alcantara Leather Wallet - Black',
    description: 'Classic Black Alcantara Leather Wallet',
    price: 4500,
    oldPrice: null,
    category: 'wallets',
    subcategory: 'leather-wallets',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 189,
    stock: 20,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Wallets - Card Holders
  {
    name: 'Alcantara Card Holder - Brown',
    description: 'Elegant Brown Alcantara Card Holder',
    price: 2200,
    oldPrice: null,
    category: 'wallets',
    subcategory: 'card-holders',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 145,
    stock: 50,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Wallets - Coin Purses
  {
    name: 'Alcantara Coin Purse - Navy Blue',
    description: 'Compact Navy Blue Alcantara Coin Purse',
    price: 1200,
    oldPrice: null,
    category: 'wallets',
    subcategory: 'coin-purses',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 98,
    stock: 60,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Office - Desk Organizers
  {
    name: 'Alcantara Desk Organizer - Navy Blue',
    description: 'Premium Navy Blue Alcantara Desk Organizer',
    price: 5500,
    oldPrice: null,
    category: 'office',
    subcategory: 'desk-organizers',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 98,
    stock: 15,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Office - Cable Management
  {
    name: 'Alcantara Cable Management Box - Black',
    description: 'Sleek Black Alcantara Cable Management Box',
    price: 1800,
    oldPrice: null,
    category: 'office',
    subcategory: 'cable-management',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 67,
    stock: 35,
    isNew: true,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Car & Travel - Car Organizers
  {
    name: 'Alcantara Car Organizer - Black',
    description: 'Premium Black Alcantara Car Organizer',
    price: 3800,
    oldPrice: null,
    category: 'car-travel',
    subcategory: 'car-organizers',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 123,
    stock: 25,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Car & Travel - Travel Pouches
  {
    name: 'Alcantara Travel Pouch - Gray',
    description: 'Stylish Gray Alcantara Travel Pouch',
    price: 1500,
    oldPrice: null,
    category: 'car-travel',
    subcategory: 'travel-pouches',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 89,
    stock: 70,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: true,
    isActive: true
  },
  
  // Sale - Clearance Items
  {
    name: 'iPhone 15 Pro Alcantara Case - Dream Blue - Clearance',
    description: 'Dream Blue Alcantara Case for iPhone 15 Pro - Clearance Price',
    price: 1999,
    oldPrice: 3000,
    category: 'sale',
    subcategory: 'clearance-items',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 5,
    reviews: 230,
    stock: 10,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  },
  
  // Sale - Seasonal Deals
  {
    name: 'Alcantara Wireless Charger - Summer Special',
    description: 'Premium Alcantara Wireless Charger - Summer Special Deal',
    price: 2500,
    oldPrice: 3500,
    category: 'sale',
    subcategory: 'seasonal-deals',
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    rating: 4,
    reviews: 145,
    stock: 20,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    isActive: true
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert ALCANSIDE products
    const insertedProducts = await Product.insertMany(alcansideProducts);
    console.log(`Successfully inserted ${insertedProducts.length} ALCANSIDE products`);

    // Log category counts
    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nProduct counts by category:');
    categoryCounts.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedProducts();
