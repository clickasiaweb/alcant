const { supabaseService } = require('../config/supabase');

class OrderService {
  // Create a new order
  static async createOrder(orderData) {
    try {
      const { data, error } = await supabaseService
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get all orders (admin)
  static async getAllOrders(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        orderStatus,
        paymentStatus,
        dateFrom,
        dateTo,
        sortBy = 'created_at:desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = supabaseService
        .from('orders')
        .select('*', { count: 'exact' });

      // Search functionality
      if (search) {
        const searchRegex = `%${search}%`;
        query = query.or(`order_id.ilike.${searchRegex},shipping_address->>firstName.ilike.${searchRegex},shipping_address->>lastName.ilike.${searchRegex},shipping_address->>email.ilike.${searchRegex},shipping_address->>phone.ilike.${searchRegex}`);
      }

      // Filters
      if (orderStatus) query = query.eq('order_status', orderStatus);
      if (paymentStatus) query = query.eq('payment_status', paymentStatus);
      
      // Date range
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', dateTo);

      // Sorting
      const [column, order] = sortBy.split(':');
      query = query.order(column, { ascending: order === 'asc' });

      // Pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
          hasNext: page < Math.ceil((count || 0) / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(id) {
    try {
      const { data, error } = await supabaseService
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }

  // Get order by order ID
  static async getOrderByOrderId(orderId) {
    try {
      const { data, error } = await supabaseService
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order by order ID:', error);
      throw error;
    }
  }

  // Get user's orders
  static async getUserOrders(userId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabaseService
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
          hasNext: page < Math.ceil((count || 0) / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(id, statusData) {
    try {
      const { data, error } = await supabaseService
        .from('orders')
        .update(statusData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentData) {
    try {
      const { data, error } = await supabaseService
        .from('orders')
        .update(paymentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(id, cancelData) {
    try {
      const { data, error } = await supabaseService
        .from('orders')
        .update(cancelData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStats(period = '30d') {
    try {
      let startDate = new Date();
      if (period === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (period === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      } else if (period === '1y') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const startDateStr = startDate.toISOString();

      // Get order statistics
      const { data: orderStats, error: statsError } = await supabaseService
        .from('orders')
        .select('total_amount, order_status, payment_status')
        .gte('created_at', startDateStr);

      if (statsError) throw statsError;

      const totalOrders = orderStats.length;
      const totalRevenue = orderStats.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Group by status
      const ordersByStatus = orderStats.reduce((acc, order) => {
        acc[order.order_status] = (acc[order.order_status] || 0) + 1;
        return acc;
      }, {});

      const ordersByPaymentStatus = orderStats.reduce((acc, order) => {
        acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
        return acc;
      }, {});

      // Get recent orders
      const { data: recentOrders, error: recentError } = await supabaseService
        .from('orders')
        .select('*')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      return {
        totalOrders,
        totalRevenue,
        ordersByStatus,
        ordersByPaymentStatus,
        recentOrders
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  // Update product stock
  static async updateProductStock(productId, quantity) {
    try {
      // Get current stock
      const { data: currentProduct } = await supabaseService
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Update stock
      const { data, error } = await supabaseService
        .from('products')
        .update({ stock: (currentProduct.stock || 0) + quantity })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }

  // Validate order status transition
  static canUpdateStatus(currentStatus, newStatus, paymentStatus) {
    // Cancelled orders cannot be updated
    if (currentStatus === 'Cancelled') {
      return { allowed: false, reason: 'Cancelled orders cannot be updated' };
    }

    // Delivered orders can only be updated to specific statuses
    if (currentStatus === 'Delivered') {
      const allowedStatuses = ['Delivered', 'Cancelled'];
      if (!allowedStatuses.includes(newStatus)) {
        return { allowed: false, reason: 'Delivered orders can only be cancelled' };
      }
    }

    // Payment must be paid for most status updates (except cancellation)
    if (paymentStatus !== 'Paid' && newStatus !== 'Cancelled' && newStatus !== 'Pending') {
      return { allowed: false, reason: 'Order must be paid to update status' };
    }

    return { allowed: true };
  }

  // Get next possible statuses
  static getNextPossibleStatuses(currentStatus) {
    const statusFlow = {
      'Pending': ['Confirmed', 'Cancelled'],
      'Confirmed': ['Processing', 'Cancelled'],
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Out for Delivery'],
      'Out for Delivery': ['Delivered']
    };

    return statusFlow[currentStatus] || [];
  }

  // Generate unique order ID
  static generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }

  // Calculate order totals
  static calculateTotals(products, taxRate = 0.18, freeShippingThreshold = 1000, shippingCost = 50) {
    const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const tax = subtotal * taxRate;
    const shipping = subtotal > freeShippingThreshold ? 0 : shippingCost;
    const discount = 0; // Can be modified based on promotions
    const totalAmount = subtotal + tax + shipping - discount;

    return {
      subtotal,
      tax,
      shipping,
      discount,
      totalAmount
    };
  }
}

module.exports = OrderService;
