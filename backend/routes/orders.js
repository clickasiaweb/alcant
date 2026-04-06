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

// Import middleware
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes (none for orders - all orders require authentication)

// Protected routes
router.use(authMiddleware); // All order routes require authentication

// Admin routes
router.get('/', adminMiddleware, getAllOrders);
router.get('/stats', adminMiddleware, getOrderStats);
router.get('/order/:orderId', getOrderByOrderId);

// User routes
router.get('/my-orders', getUserOrders);
router.post('/', createOrder);

// Order management routes
router.get('/:id', getOrderById);
router.put('/:id/status', adminMiddleware, updateOrderStatus);
router.put('/:id/payment-status', adminMiddleware, updatePaymentStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
