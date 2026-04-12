import { supabase } from './supabase';

// Supabase Cart Service
class SupabaseCartService {
  constructor() {
    this.tableName = 'cart_items';
  }

  // Get cart items for a user
  async getCartItems(userId) {
    try {
      // Query with product relationship to get complete product details
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          products:product_id (
            id,
            name,
            price,
            old_price,
            description,
            images,
            category,
            slug,
            in_stock
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(error.message);
      }

      // Transform the data to match expected cart item structure
      const transformedData = (data || []).map(item => ({
        ...item,
        // Map product fields to cart item structure
        name: item.products?.name || `Product ${item.product_id}`,
        price: item.products?.price || 0,
        originalPrice: item.products?.old_price || item.products?.price || 0,
        image: item.products?.images?.[0] || '/images/products/default.jpg',
        category: item.products?.category || 'Unknown',
        slug: item.products?.slug || `product-${item.product_id}`,
        inStock: item.products?.in_stock !== false,
        // Keep existing cart item fields
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        selected_color: item.selected_color || 'Standard',
        selected_size: item.selected_size || 'Standard',
        variant: item.selected_color || 'Standard'
      }));

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
      // Check if item already exists
      const { data: existingItem, error: checkError } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('selected_color', options.selected_color || null)
        .eq('selected_size', options.selected_size || null)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(checkError.message);
      }

      if (existingItem) {
        // Update quantity if item exists
        const { data, error } = await supabase
          .from(this.tableName)
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } else {
        // Add new item
        const { data, error } = await supabase
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

        if (error) {
          throw new Error(error.message);
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
