import { supabase } from './supabase';

// Supabase Order Service
class SupabaseOrderService {
  constructor() {
    this.tableName = 'orders';
    this.orderItemsTable = 'order_items';
    this.statusHistoryTable = 'order_status_history';
  }

  // Create order with items
  async createOrder(orderData) {
    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from(this.tableName)
        .insert({
          user_id: orderData.user_id,
          order_number: orderNumber,
          total_amount: orderData.total_amount,
          status: 'pending',
          payment_status: 'pending',
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address || orderData.shipping_address,
          notes: orderData.notes
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(orderError.message);
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        selected_color: item.selected_color,
        selected_size: item.selected_size
      }));

      const { data: items, error: itemsError } = await supabase
        .from(this.orderItemsTable)
        .insert(orderItems)
        .select();

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      return {
        ...order,
        items: items || []
      };
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Get orders for a user
  async getUserOrders(userId, options = {}) {
    try {
      let query = supabase
        .from(this.tableName)
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price,
            selected_color,
            selected_size
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  }

  // Get single order by ID
  async getOrderById(orderId, userId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price,
            selected_color,
            selected_size
          ),
          order_status_history (
            id,
            status,
            notes,
            created_at
          )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Add to status history
      await this.addStatusHistory(orderId, status, notes);

      return data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, userId, reason = '') {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Add to status history
      await this.addStatusHistory(orderId, 'cancelled', reason);

      return data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  // Add status history entry
  async addStatusHistory(orderId, status, notes = '') {
    try {
      const { error } = await supabase
        .from(this.statusHistoryTable)
        .insert({
          order_id: orderId,
          status,
          notes
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Add status history error:', error);
      throw error;
    }
  }

  // Get order status history
  async getOrderStatusHistory(orderId) {
    try {
      const { data, error } = await supabase
        .from(this.statusHistoryTable)
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get order status history error:', error);
      throw error;
    }
  }

  // Generate unique order number
  async generateOrderNumber() {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `ORD${timestamp}${random}`;
    } catch (error) {
      console.error('Generate order number error:', error);
      throw error;
    }
  }

  // Get order statistics for a user
  async getUserOrderStats(userId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('status, total_amount, created_at')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      const stats = {
        totalOrders: data?.length || 0,
        totalSpent: data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
        pendingOrders: data?.filter(order => order.status === 'pending').length || 0,
        completedOrders: data?.filter(order => order.status === 'delivered').length || 0,
        cancelledOrders: data?.filter(order => order.status === 'cancelled').length || 0
      };

      return stats;
    } catch (error) {
      console.error('Get user order stats error:', error);
      throw error;
    }
  }

  // Get all orders (admin only)
  async getAllOrders(options = {}) {
    try {
      let query = supabase
        .from(this.tableName)
        .select(`
          *,
          profiles:user_id (
            name,
            email
          ),
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }
}

export const orderService = new SupabaseOrderService();
export default orderService;
