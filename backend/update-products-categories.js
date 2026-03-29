// Script to update existing products with sub-subcategory IDs for testing
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductsWithSubSubcategories() {
  console.log('🔧 Updating products with sub-subcategory IDs...\n');

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`📦 Found ${products.length} products`);

    // Get categories hierarchy
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        subcategories (
          id,
          name,
          slug,
          sub_subcategories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('is_active', true);

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
      return;
    }

    console.log(`📂 Found ${categories.length} categories`);

    // Create a mapping for easy lookup
    const categoryMap = {};
    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.sub_subcategories.forEach(subSubcategory => {
          const key = `${category.name.toLowerCase()}-${subcategory.name.toLowerCase()}-${subSubcategory.name.toLowerCase()}`;
          categoryMap[key] = {
            sub_subcategory_id: subSubcategory.id,
            sub_subcategory: subSubcategory.name
          };
        });
      });
    });

    console.log('🗺️  Category mapping created');

    // Update products based on their names
    let updatedCount = 0;
    for (const product of products) {
      let updateData = {};

      // Simple heuristic: match product names to sub-subcategories
      if (product.name.toLowerCase().includes('iphone 15 pro')) {
        const mapping = categoryMap['phone cases-iphone cases-iphone 15 pro case'];
        if (mapping) {
          updateData = {
            sub_subcategory_id: mapping.sub_subcategory_id,
            sub_subcategory: mapping.sub_subcategory,
            subcategory_id: categories.find(c => c.name === 'Phone Cases')?.subcategories.find(s => s.name === 'iPhone Cases')?.id
          };
        }
      } else if (product.name.toLowerCase().includes('samsung')) {
        const mapping = categoryMap['phone cases-samsung cases-samsung galaxy case'];
        if (mapping) {
          updateData = {
            sub_subcategory_id: mapping.sub_subcategory_id,
            sub_subcategory: mapping.sub_subcategory,
            subcategory_id: categories.find(c => c.name === 'Phone Cases')?.subcategories.find(s => s.name === 'Samsung Cases')?.id
          };
        }
      } else if (product.name.toLowerCase().includes('wallet')) {
        const mapping = categoryMap['wallets & cards-full wallets-full wallets'];
        if (mapping) {
          updateData = {
            sub_subcategory_id: mapping.sub_subcategory_id,
            sub_subcategory: mapping.sub_subcategory,
            subcategory_id: categories.find(c => c.name === 'Wallets & Cards')?.subcategories.find(s => s.name === 'Full Wallets')?.id
          };
        }
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating product ${product.name}:`, updateError);
        } else {
          console.log(`✅ Updated: ${product.name} -> ${updateData.sub_subcategory}`);
          updatedCount++;
        }
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} products with sub-subcategory information!`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updateProductsWithSubSubcategories();
