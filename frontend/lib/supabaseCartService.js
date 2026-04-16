import { supabase } from './supabase';

// Supabase Cart Service
class SupabaseCartService {
  constructor() {
    this.tableName = 'cart_items';
  }

  // Get cart items for a user
  async getCartItems(userId) {
    try {
      console.log('Getting cart items for user:', userId);
      
      // Validate input
      if (!userId) {
        console.error('Invalid user ID provided');
        return [];
      }
      
      // First try the simple query without relationships
      let cartData, cartError;
      
      try {
        const result = await supabase
          .from(this.tableName)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        cartData = result.data;
        cartError = result.error;
      } catch (queryError) {
        console.error('Query execution error:', queryError);
        cartError = queryError;
      }

      if (cartError) {
        console.error('Supabase cart query error:', cartError);
        console.error('Error details:', JSON.stringify(cartError, null, 2));
        
        // If it's a 400 error, the table might not exist or have permission issues
        if (cartError.code === '400' || cartError.message?.includes('400')) {
          console.log('Cart table may not exist or has permission issues, returning empty cart');
          return [];
        }
        
        throw new Error(`Cart query failed: ${cartError.message}`);
      }

      console.log('Cart data retrieved:', cartData?.length || 0, 'items');

      if (!cartData || cartData.length === 0) {
        return [];
      }

      // Get product details for each cart item
      const productIds = cartData.map(item => item.product_id).filter(Boolean);
      let productsData = [];

      if (productIds.length > 0) {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, old_price, description, images, category, slug, in_stock')
          .in('id', productIds);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          // Continue with cart data even if products fail
        } else {
          productsData = products || [];
          console.log('Products data retrieved:', productsData.length, 'products');
        }
      }

      // Transform the data to match expected cart item structure
      const transformedData = cartData.map(item => {
        const product = productsData.find(p => p.id === item.product_id);
        return {
          ...item,
          // Map product fields to cart item structure
          name: product?.name || `Product ${item.product_id}`,
          price: product?.price || 0,
          originalPrice: product?.old_price || product?.price || 0,
          image: product?.images?.[0] || '/images/products/default.jpg',
          category: product?.category || 'Unknown',
          slug: product?.slug || `product-${item.product_id}`,
          inStock: product?.in_stock !== false,
          // Keep existing cart item fields
          product_id: item.product_id,
          quantity: item.quantity,
          selected_color: item.selected_color || 'Standard',
          selected_size: item.selected_size || 'Standard',
          variant: item.selected_color || 'Standard'
        };
      });

      console.log('Transformed cart items:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Get cart items error:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(userId, productId, quantity = 1, options = {}) {
    try {
      console.log('Adding to cart:', { userId, productId, quantity, options });
      
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
        console.error('Check existing item query error:', queryError);
        checkError = queryError;
      }

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Check existing item error:', checkError);
        
        // If table doesn't exist or permission error, return fallback
        if (checkError.code === '400' || checkError.message?.includes('400') || checkError.message?.includes('permission')) {
          console.log('Cart table not accessible, returning fallback cart item');
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
          console.error('Update query error:', updateError);
          error = updateError;
        }

        if (error) {
          console.error('Update cart item error:', error);
          
          // If table doesn't exist or permission error, return fallback
          if (error.code === '400' || error.message?.includes('400') || error.message?.includes('permission')) {
            console.log('Cart table not accessible for update, returning fallback cart item');
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
          const result = await supabase
            .from(this.tableName)
            .insert({
              user_id: userId,
              product_id: productId,
              quantity,
              selected_color: options.selected_color || null,
              selected_size: options.selected_size || null
            })
            .select()
            .single();
          
          data = result.data;
          error = result.error;
        } catch (insertError) {
          console.error('Insert query error:', insertError);
          error = insertError;
        }

        if (error) {
          console.error('Insert cart item error:', error);
          
          // If table doesn't exist or permission error, return fallback
          if (error.code === '400' || error.message?.includes('400') || error.message?.includes('permission')) {
            console.log('Cart table not accessible for insert, returning fallback cart item');
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
          
          throw new Error(`Insert cart item failed: ${error.message}`);
        }

        return data;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
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
      console.error('Update quantity error:', error);
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
      console.error('Remove from cart error:', error);
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
      console.error('Clear cart error:', error);
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
      console.error('Get cart summary error:', error);
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
          console.error('Failed to merge cart item:', error);
          results.failed++;
        }
      }

      return results;
    } catch (error) {
      console.error('Merge carts error:', error);
      throw error;
    }
  }
}

export const cartService = new SupabaseCartService();
export default cartService;
