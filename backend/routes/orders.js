const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrderByOrderId,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderControllerSupabase');

// Public routes - Authentication disabled for now
// All order routes are publicly accessible

// Admin routes (authentication disabled)
router.get('/', getAllOrders);
router.get('/stats', getOrderStats);
router.get('/order/:orderId', getOrderByOrderId);

// User routes (authentication disabled)
router.get('/my-orders', getUserOrders);
router.post('/', createOrder);

// Order management routes (authentication disabled)
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/payment-status', updatePaymentStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
