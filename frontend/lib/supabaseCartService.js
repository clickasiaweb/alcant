import { supabase } from './supabase';

// Supabase Cart Service
class SupabaseCartService {
  constructor() {
    this.tableName = 'cart_items';
  }

  // Get cart items for a user
  async getCartItems(userId) {
    try {
      // Validate input
      if (!userId) {
        return [];
      }
      
      // Query cart items - we store all product data directly in cart_items
      const { data: cartData, error: cartError } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (cartError) {
        // If it's a 400 error, the table might not exist or have permission issues
        if (cartError.code === '400' || cartError.message?.includes('400')) {
          console.error('Cart table error:', cartError);
          return [];
        }
        
        throw new Error(`Cart query failed: ${cartError.message}`);
      }

      if (!cartData || cartData.length === 0) {
        return [];
      }

      // Return cart items directly since we store all product data in them
      return cartData.map(item => ({
        ...item,
        // Use only snake_case columns that exist in database
        name: item.product_name || item.name || `Product ${item.product_id}`,
        displayName: item.product_name || item.name || `Product ${item.product_id}`,
        price: typeof item.product_price === 'number' ? item.product_price : 
               typeof item.price === 'number' ? item.price :
               parseFloat(item.product_price) || parseFloat(item.price) || 0,
        originalPrice: typeof item.product_original_price === 'number' ? item.product_original_price :
                     typeof item.original_price === 'number' ? item.original_price :
                     typeof item.original_price === 'number' ? item.original_price :
                     parseFloat(item.product_original_price) || parseFloat(item.original_price) || parseFloat(item.price) || 0,
        image: item.product_image || item.image || 'https://via.placeholder.com/80x80/1a365d/ffffff?text=Product',
        category: item.product_category || item.category || 'Unknown',
        slug: item.product_slug || item.slug,
        description: item.product_description || item.description,
        images: item.product_images || item.images,
        variant: item.product_variant || item.variant || item.selected_color || 'Standard',
        quantity: item.quantity || 1
      }));
    } catch (error) {
      console.error('Error in getCartItems:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(userId, productId, quantity = 1, options = {}, productData = null) {
    try {
      
      // Validate inputs
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }
      
      // Check if item already exists
      let existingItem, checkError;
      
      try {
        const result = await supabase
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .eq('selected_color', options.selected_color || null)
          .eq('selected_size', options.selected_size || null)
          .single();
        
        existingItem = result.data;
        checkError = result.error;
      } catch (queryError) {
        checkError = queryError;
      }

      if (checkError && checkError.code !== 'PGRST116') {
        
        // If table doesn't exist or permission error, return fallback
        if (checkError.code === '400' || checkError.message?.includes('400') || checkError.message?.includes('permission')) {
          return {
            id: 'fallback-' + Date.now(),
            user_id: userId,
            product_id: productId,
            quantity,
            selected_color: options.selected_color,
            selected_size: options.selected_size,
            created_at: new Date().toISOString()
          };
        }
        
        throw new Error(`Check existing item failed: ${checkError.message}`);
      }

      if (existingItem) {
        // Update quantity if item exists
        let data, error;
        
        try {
          const result = await supabase
            .from(this.tableName)
            .update({
              quantity: existingItem.quantity + quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingItem.id)
            .select()
            .single();
          
          data = result.data;
          error = result.error;
        } catch (updateError) {
          error = updateError;
        }

        if (error) {
          
          // If table doesn't exist or permission error, return fallback
          if (error.code === '400' || error.message?.includes('400') || error.message?.includes('permission')) {
              return {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
              updated_at: new Date().toISOString()
            };
          }
          
          throw new Error(`Update cart item failed: ${error.message}`);
        }

        return data;
      } else {
        // Add new item
        let data, error;
        
        try {
          const insertData = {
            user_id: userId,
            product_id: productId,
            quantity,
            selected_color: options.selected_color || null,
            selected_size: options.selected_size || null
          };
          
          // Add product data if provided (use only snake_case columns that exist in database)
          if (productData) {
            // Snake_case columns (PostgreSQL convention) - these exist in database
            insertData.product_name = productData.name;
            insertData.product_price = productData.price;
            insertData.product_original_price = productData.originalPrice || productData.old_price;
            insertData.product_image = productData.image;
            insertData.product_category = productData.category;
            insertData.product_slug = productData.slug;
            insertData.product_description = productData.description;
            insertData.product_images = productData.images;
            insertData.product_variant = productData.variant || productData.selected_color;
            
            // Don't use camelCase columns - they don't exist in the database schema cache
          }
          
          const result = await supabase
            .from(this.tableName)
            .insert(insertData)
            .select()
            .single();
          
          data = result.data;
          error = result.error;
        } catch (insertError) {
          error = insertError;
        }

        if (error) {
          console.error('Cart insert error:', error);
          
          // If table doesn't exist or permission error, return fallback with product data
          if (error.code === '400' || error.message?.includes('400') || error.message?.includes('permission')) {
            console.log('Using fallback with product data');
            return {
              id: 'fallback-' + Date.now(),
              user_id: userId,
              product_id: productId,
              quantity,
              selected_color: options.selected_color,
              selected_size: options.selected_size,
              // Include product data in fallback (use snake_case)
              product_name: productData?.name || 'Unknown Product',
              product_price: productData?.price || 0,
              product_original_price: productData?.originalPrice || productData?.old_price || 0,
              product_image: productData?.image || 'https://via.placeholder.com/80x80/1a365d/ffffff?text=Product',
              product_category: productData?.category || 'Unknown',
              product_slug: productData?.slug,
              product_description: productData?.description,
              product_images: productData?.images,
              product_variant: options.selected_color || productData?.variant || 'Standard',
              created_at: new Date().toISOString()
            };
          }
          
          throw new Error(`Insert cart item failed: ${error.message}`);
        }

        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  // Update cart item quantity
  async updateQuantity(itemId, newQuantity) {
    try {
      if (newQuantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(itemId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', itemId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Clear entire cart for a user
  async clearCart(userId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get cart summary (total items, subtotal)
  async getCartSummary(userId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          quantity,
          products:product_id (
            price,
            old_price
          )
        `)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      const summary = {
        totalItems: 0,
        subtotal: 0,
        totalDiscount: 0
      };

      data.forEach(item => {
        summary.totalItems += item.quantity;
        const price = item.products.old_price || item.products.price;
        summary.subtotal += price * item.quantity;
        if (item.products.old_price) {
          summary.totalDiscount += (item.products.old_price - item.products.price) * item.quantity;
        }
      });

      return summary;
    } catch (error) {
      throw error;
    }
  }

  // Merge local cart with database cart
  async mergeCarts(userId, localCartItems) {
    try {
      const results = {
        merged: 0,
        updated: 0,
        failed: 0
      };

      for (const localItem of localCartItems) {
        try {
          await this.addToCart(
            userId,
            localItem.product_id || localItem.id,
            localItem.quantity,
            {
              selected_color: localItem.selected_color || localItem.variant,
              selected_size: localItem.selected_size
            }
          );
          results.merged++;
        } catch (error) {
          results.failed++;
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}

export const cartService = new SupabaseCartService();
export default cartService;
