// Load environment variables
require('dotenv').config();

const { supabase } = require('./config/supabase');

// Add test products to categories
async function addTestProducts() {
  try {
    // Get the rtgrgdfg category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'dfgf')
      .single();
    
    if (categoryError || !category) {
      console.log('Category not found:', categoryError);
      return;
    }
    
    console.log('Found category:', category.name, 'ID:', category.id);
    
    // Create test products
    const testProducts = [
      {
        name: 'Premium Phone Case',
        slug: 'premium-phone-case',
        description: 'High-quality phone case with premium materials',
        price: 89.99,
        old_price: 119.99,
        final_price: 89.99,
        category_id: category.id, // Use category_id for Supabase
        subcategory: 'phone',
        images: [],
        image: 'test-image.jpg',
        rating: 4,
        reviews: 12,
        stock: 25,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false,
        is_active: true
      },
      {
        name: 'General Accessory',
        slug: 'general-accessory',
        description: 'Multi-purpose accessory for everyday use',
        price: 45.99,
        old_price: null,
        final_price: 45.99,
        category_id: category.id, // Use category_id for Supabase
        subcategory: 'general',
        images: [],
        image: 'test-image.jpg',
        rating: 3,
        reviews: 8,
        stock: 15,
        is_new: false,
        is_limited_edition: false,
        is_blue_monday_sale: false,
        is_active: true
      },
      {
        name: 'Test Subcategory Product',
        slug: 'test-subcategory-product',
        description: 'Product for testing subcategory filtering',
        price: 125.99,
        old_price: 149.99,
        final_price: 125.99,
        category_id: category.id, // Use category_id for Supabase
        subcategory: 'test-subcategory',
        images: [],
        image: 'test-image.jpg',
        rating: 5,
        reviews: 3,
        stock: 10,
        is_new: true,
        is_limited_edition: false,
        is_blue_monday_sale: false,
        is_active: true
      }
    ];
    
    // Insert test products
    for (const product of testProducts) {
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', product.slug)
        .single();
      
      if (!existingProduct && !checkError) {
        const { data, error } = await supabase
          .from('products')
          .insert([product])
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
    
    console.log('Test products added successfully!');
    
  } catch (error) {
    console.error('Error adding test products:', error);
  }
}

addTestProducts();
