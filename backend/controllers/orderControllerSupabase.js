const OrderService = require('../models/SupabaseOrder');

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const result = await OrderService.getAllOrders(req.query);
    
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public (authentication disabled)
exports.getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);

    // Authentication disabled - skip user access check
    // if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to access this order'
    //   });
    // }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.message?.includes('PGRST116')) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Get order by Order ID
// @route   GET /api/orders/order/:orderId
// @access  Public (authentication disabled)
exports.getOrderByOrderId = async (req, res) => {
  try {
    const { data: order, error } = await supabaseService
      .from('orders')
      .select('*')
      .eq('order_id', req.params.orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    // Authentication disabled - skip user access check
    // if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to access this order'
    //   });
    // }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/my-orders
// @access  Public (authentication disabled)
exports.getUserOrders = async (req, res) => {
  try {
    // Authentication disabled - use a default user ID or get from query params
    const userId = req.query.userId || 'default-user-id';
    const result = await OrderService.getUserOrders(userId, req.query);
    
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (authentication disabled)
exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentDetails,
      notes,
      estimatedDelivery
    } = req.body;

    // Validate products
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product is required'
      });
    }

    // Calculate total amount
    let subtotal = 0;
    const orderProducts = [];

    for (const item of products) {
      // For testing, skip product validation and use item data directly
      const orderProduct = {
        id: item.productId,
        name: item.name || `Product ${item.productId}`,
        price: item.price || 1000,
        quantity: item.quantity,
        image: item.image || '/images/products/default.jpg',
        variant: item.variant
      };
      orderProducts.push(orderProduct);
      
      // Calculate subtotal
      subtotal += (orderProduct.price * orderProduct.quantity);
    }

    // Calculate totals
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping above 1000
    const discount = 0; // Can be modified based on promotions
    const totalAmount = subtotal + tax + shipping - discount;

    // Generate unique order ID
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderId = `ORD${timestamp}${random}`;

    // Authentication disabled - use default user ID
    const defaultUserId = '00000000-0000-0000-0000-000000000000';

    // Create order
    console.log('Creating order with data:', {
      order_id: orderId,
      user_id: defaultUserId,
      products_count: orderProducts.length,
      subtotal,
      tax,
      shipping,
      total_amount: totalAmount,
      payment_method: paymentMethod
    });

    const { data: order, error } = await supabaseService
      .from('orders')
      .insert({
        order_id: orderId,
        user_id: defaultUserId, // Use default user ID when authentication is disabled
        products: orderProducts,
        subtotal,
        tax,
        shipping,
        discount,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
        payment_method: paymentMethod,
        payment_details: paymentDetails || {},
        notes,
        estimated_delivery: estimatedDelivery,
        payment_status: paymentDetails?.paidAt ? 'Paid' : 'Pending',
        status_history: [{
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed',
          updatedBy: 'system' // Use system instead of user ID
        }]
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    // Skip stock update for testing (products might not exist in database)
    // Stock update can be re-enabled later when product validation is fixed

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw fetchError;
    }

    // Check if status can be updated
    if (currentOrder.order_status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled orders cannot be updated'
      });
    }

    if (currentOrder.order_status === 'Delivered' && status !== 'Delivered' && status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders can only be cancelled'
      });
    }

    if (currentOrder.payment_status !== 'Paid' && status !== 'Cancelled' && status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Order must be paid to update status'
      });
    }

    // Prepare update data
    const updateData = {
      order_status: status,
      updated_at: new Date().toISOString()
    };

    if (trackingId) {
      updateData.tracking_id = trackingId;
    }

    // Add status to history
    const statusHistory = currentOrder.status_history || [];
    statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`,
      updatedBy: 'admin-user' // Use default when authentication is disabled
    });
    updateData.status_history = statusHistory;

    // Set specific timestamps based on status
    if (status === 'Delivered') {
      updateData.actual_delivery = new Date().toISOString();
    } else if (status === 'Cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      if (note) {
        updateData.cancellation_reason = note;
      }
    }

    const { data: order, error } = await supabaseService
      .from('orders')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, paymentDetails } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }

    const updateData = {
      payment_status: status,
      updated_at: new Date().toISOString()
    };

    if (paymentDetails) {
      updateData.payment_details = paymentDetails;
    }

    if (status === 'Paid' && !paymentDetails?.paidAt) {
      updateData.payment_details = {
        ...updateData.payment_details,
        paidAt: new Date().toISOString()
      };
    }

    const { data: order, error } = await supabaseService
      .from('orders')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: order,
      message: `Payment status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Public (authentication disabled)
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw fetchError;
    }

    // Authentication disabled - skip user access check
    // if (req.user.role !== 'admin' && currentOrder.user_id !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to cancel this order'
    //   });
    // }

    // Check if order can be cancelled
    if (currentOrder.order_status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    if (currentOrder.order_status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be cancelled'
      });
    }

    // Cancel the order
    const statusHistory = currentOrder.status_history || [];
    statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      note: reason || 'Order cancelled',
      updatedBy: 'admin-user' // Use default when authentication is disabled
    });

    const { data: order, error } = await supabaseService
      .from('orders')
      .update({
        order_status: 'Cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
        status_history: statusHistory,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Restore product stock
    for (const item of currentOrder.products) {
      const { data: currentProduct } = await supabaseService
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .single();
      
      await supabaseService
        .from('products')
        .update({ stock: (currentProduct.stock || 0) + item.quantity })
        .eq('id', item.productId);
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const stats = await OrderService.getOrderStats(period);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};
