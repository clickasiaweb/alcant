const OrderService = require('../models/SupabaseOrder');
const { supabaseService } = require('../config/supabase');

const normalizeStatusToDb = (status) => {
  if (!status || typeof status !== 'string') return null;
  return status.trim().toLowerCase();
};

const titleCaseStatus = (status) => {
  if (!status || typeof status !== 'string') return 'Pending';
  return status
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

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

// @desc    Get order by order_id
// @route   GET /api/orders/order/:orderId
// @access  Public
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

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order by order_id:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Public (authentication disabled)
exports.getUserOrders = async (req, res) => {
  try {
    // If frontend provides a user_id query param, filter by it.
    const userId = req.query.user_id || null;

    let query = supabaseService
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: orders, error } = await query;

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: orders || []
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error: error.message
    });
  }
};

// @desc    Create new order (FIXED VERSION)
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
      estimatedDelivery,
      discount = 0.00
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
    const discountAmount = parseFloat(discount) || 0; // Ensure discount is a number
    const totalAmount = subtotal + tax + shipping - discountAmount;

    // Generate unique order ID
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderId = `ORD${timestamp}${random}`;

    // Generate order number
    const orderNumber = `ORD-${timestamp}`;

    // Allow frontend to pass `user_id` when available (keeps compatibility for guest orders)
    const providedUserId = req.body.user_id || null;

    console.log('Creating order with data:', {
      order_id: orderId,
      order_number: orderNumber,
      products_count: orderProducts.length,
      subtotal,
      tax,
      shipping,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      providedUserId
    });

    // Create order payload following schema; if no user id provided, use system fallback
    const orderData = {
      user_id: providedUserId || '00000000-0000-0000-0000-000000000000',
      order_id: orderId,
      order_number: orderNumber,
      products: orderProducts,
      subtotal: parseFloat(subtotal),
      tax: parseFloat(tax),
      shipping: parseFloat(shipping),
      discount: parseFloat(discountAmount),
      total_amount: parseFloat(totalAmount),
      shipping_address: shippingAddress,
      billing_address: billingAddress || shippingAddress,
      notes: notes || `Order created with products: ${orderProducts.length} items. Subtotal: ${subtotal}, Tax: ${tax}, Shipping: ${shipping}, Discount: ${discountAmount}`,
      payment_status: paymentDetails?.paidAt ? 'Paid' : 'Pending',
      payment_method: paymentMethod,
      payment_details: paymentDetails || {},
      order_status: 'pending',
      status_history: [{
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed',
        updatedBy: 'system'
      }]
    };

    const { data: order, error } = await supabaseService
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('=== ORDER CREATION ERROR DEBUG ===');
      console.error('Supabase insert error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('Order data that failed:', JSON.stringify(orderData, null, 2));
      console.error('=== END ORDER CREATION ERROR DEBUG ===');
      throw error;
    }

    // Also insert order items into `order_items` table so frontend `my-orders` queries show items
    const orderItemsPayload = orderProducts.map(p => ({
      order_id: order.id,
      product_id: p.id,
      product_name: p.name,
      quantity: p.quantity,
      price: p.price,
      selected_color: p.variant?.color || null,
      selected_size: p.variant?.size || null,
      image: p.image || null
    }));

    try {
      const { data: items, error: itemsError } = await supabaseService
        .from('order_items')
        .insert(orderItemsPayload)
        .select();

      if (itemsError) {
        console.warn('Failed to insert order_items:', itemsError.message);
      } else {
        order.order_items = items;
      }
    } catch (e) {
      console.warn('Error inserting order_items:', e.message || e);
    }

    // Ensure there's at least one status history row in the dedicated table
    try {
      const { error: statusErr } = await supabaseService
        .from('order_status_history')
        .insert({ order_id: order.id, status: 'Pending', notes: 'Order created' });
      if (statusErr) console.warn('Failed to insert status history:', statusErr.message);
    } catch (e) {
      console.warn('Error inserting status history:', e.message || e);
    }

    // Create a response with the extended order data
    const responseOrder = {
      ...order,
      order_id: order.order_id || orderId,
      order_number: order.order_number || orderNumber,
      products: orderProducts,
      subtotal,
      tax,
      shipping,
      discount: discountAmount,
      payment_method: paymentMethod,
      payment_details: paymentDetails || {},
      estimated_delivery: estimatedDelivery,
      payment_status: order.payment_status || (paymentDetails?.paidAt ? 'Paid' : 'Pending'),
      status: order.order_status || 'pending',
      status_history: order.status_history || [{
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed',
        updatedBy: 'system'
      }]
    };

    console.log('Order created successfully:', responseOrder);

    res.status(201).json({
      success: true,
      data: responseOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('=== MAIN CATCH BLOCK ERROR ===');
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    console.error('Error type:', typeof error);
    console.error('Request body received:', JSON.stringify(req.body, null, 2));
    console.error('=== END MAIN CATCH BLOCK ERROR ===');
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (authentication disabled)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, tracking_id, trackingId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const trackingValue = tracking_id !== undefined ? tracking_id : trackingId;
    const dbStatus = normalizeStatusToDb(status);
    const labelStatus = titleCaseStatus(status);

    if (!dbStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Try to read existing status_history. If blocked by RLS/policies, continue without it.
    let statusHistory = [];
    try {
      const { data: existingOrder, error: existingError } = await supabaseService
        .from('orders')
        .select('status_history')
        .eq('id', req.params.id)
        .maybeSingle();

      if (existingError) {
        console.warn('Could not read existing status_history, continuing with fresh history entry:', existingError.message);
      } else {
        statusHistory = existingOrder?.status_history;
        if (!Array.isArray(statusHistory)) {
          try {
            statusHistory = JSON.parse(statusHistory || '[]');
          } catch {
            statusHistory = [];
          }
        }
      }
    } catch (readError) {
      console.warn('Status history read threw error, continuing:', readError.message);
      statusHistory = [];
    }
    statusHistory.push({
      status: labelStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${labelStatus}`,
      updatedBy: 'admin'
    });

    const updatePayload = {
      order_status: dbStatus,
      notes: note || `Status updated to ${labelStatus}`,
      status_history: statusHistory,
      updated_at: new Date().toISOString()
    };

    if (trackingValue !== undefined) {
      updatePayload.tracking_id = trackingValue || null;
    }

      let { data: order, error } = await supabaseService
        .from('orders')
        .update(updatePayload)
        .eq('id', req.params.id)
        .select()
        .maybeSingle();

    // Production schema fallback: if optional columns fail, retry with core fields only
      if (error) {
        console.error('Primary status update failed, retrying with core fields:', error.message);
        const corePayload = {
          order_status: dbStatus,
          notes: note || `Status updated to ${labelStatus}`,
          updated_at: new Date().toISOString()
      };

        const retry = await supabaseService
          .from('orders')
          .update(corePayload)
          .eq('id', req.params.id)
          .select()
          .maybeSingle();

        order = retry.data;
        error = retry.error;
      }

      if (!error && !order) {
        return res.status(403).json({
          success: false,
          message: 'Status update blocked (likely RLS). Configure SUPABASE_SERVICE_ROLE_KEY on backend.'
        });
      }

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          });
        }
        console.error('Final status update failure details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
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
// @access  Public (authentication disabled)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const paymentStatus = req.body.paymentStatus || req.body.status;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }

    const { data: order, error } = await supabaseService
      .from('orders')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
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

    res.status(200).json({
      success: true,
      data: order,
      message: 'Payment status updated successfully'
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

    const { data: order, error } = await supabaseService
      .from('orders')
      .update({
        order_status: 'cancelled',
        notes: reason || 'Order cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
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
// @access  Public (authentication disabled)
exports.getOrderStats = async (req, res) => {
  try {
    // Get total orders
    const { data: totalOrders, error: totalError } = await supabaseService
      .from('orders')
      .select('id', { count: 'exact' });

    if (totalError) throw totalError;

    // Get orders by status
    const { data: ordersByStatus, error: statusError } = await supabaseService
      .from('orders')
      .select('order_status');

    if (statusError) throw statusError;

    const stats = {
      totalOrders: totalOrders.length,
      ordersByStatus: ordersByStatus.reduce((acc, order) => {
        const key = order.order_status || 'Unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
      totalRevenue: 0 // Calculate if needed
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order stats',
      error: error.message
    });
  }
};
