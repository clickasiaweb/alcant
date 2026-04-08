import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  FiPackage, 
  FiUser, 
  FiMapPin, 
  FiCreditCard, 
  FiTruck,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiArrowLeft,
  FiRefreshCw,
  FiXCircle
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { orderService } from '../lib/supabaseOrderService';
import { getServerSideAuth } from '../lib/serverAuth';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
  'Processing': 'bg-purple-100 text-purple-800 border-purple-200',
  'Shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Out for Delivery': 'bg-orange-100 text-orange-800 border-orange-200',
  'Delivered': 'bg-green-100 text-green-800 border-green-200',
  'Cancelled': 'bg-red-100 text-red-800 border-red-200'
};

const statusIcons = {
  'Pending': FiClock,
  'Confirmed': FiCheckCircle,
  'Processing': FiPackage,
  'Shipped': FiTruck,
  'Out for Delivery': FiTruck,
  'Delivered': FiCheckCircle,
  'Cancelled': FiAlertCircle
};

const paymentStatusColors = {
  'Paid': 'bg-green-100 text-green-800 border-green-200',
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Failed': 'bg-red-100 text-red-800 border-red-200',
  'Refunded': 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function MyOrdersPage({ user: serverUser, isAuthenticated: serverIsAuthenticated }) {
  const router = useRouter();
  const { user, isAuthenticated } = useSupabaseAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Server-side authentication check
  useEffect(() => {
    if (typeof window === 'undefined') {
      if (!serverIsAuthenticated) {
        router.push('/login');
        return;
      }
    }
  }, [serverIsAuthenticated, router]);

  // Client-side authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isAuthenticated()) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated() || !user) {
        router.push('/login');
        return;
      }

      const userOrders = await orderService.getUserOrders(user.id, {
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit
      });
      
      setOrders(userOrders);
      setPagination(prev => ({
        ...prev,
        total: userOrders.length,
        pages: Math.ceil(userOrders.length / pagination.limit)
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user, pagination.page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleOrderDetails = async (order) => {
    try {
      const orderDetails = await orderService.getOrderById(order.id, user.id);
      setSelectedOrder(orderDetails);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const OrderStatusTracker = ({ status }) => {
    const statusFlow = [
      { key: 'Pending', label: 'Order Placed' },
      { key: 'Confirmed', label: 'Confirmed' },
      { key: 'Processing', label: 'Processing' },
      { key: 'Shipped', label: 'Shipped' },
      { key: 'Out for Delivery', label: 'Out for Delivery' },
      { key: 'Delivered', label: 'Delivered' }
    ];

    const currentStatusIndex = statusFlow.findIndex(step => step.key === status);
    const isCancelled = status === 'Cancelled';

    if (isCancelled) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-800">Order Cancelled</p>
            <p className="text-sm text-red-600 mt-1">This order has been cancelled</p>
          </div>
        </div>
      );
    }

    return (
      <div className="py-4">
        {statusFlow.map((step, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const StepIcon = statusIcons[step.key] || FiClock;
          
          return (
            <div key={step.key} className="flex items-center mb-4 last:mb-0">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isActive 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'bg-gray-200 border-gray-300 text-gray-400'
              }`}>
                <StepIcon className="h-4 w-4" />
              </div>
              <div className="ml-4 flex-1">
                <div className={`font-medium ${
                  isActive ? 'text-green-800' : 'text-gray-400'
                }`}>
                  {step.label}
                </div>
                {isCurrent && (
                  <div className="text-sm text-gray-600 mt-1">Current status</div>
                )}
                {isActive && !isCurrent && (
                  <div className="text-sm text-green-600 mt-1">Completed</div>
                )}
              </div>
              {index < statusFlow.length - 1 && (
                <div className={`ml-4 w-8 h-8 ${
                  isActive && index < currentStatusIndex 
                    ? 'border-l-2 border-green-500' 
                    : 'border-l-2 border-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>My Orders - Alcantara</title>
        </Head>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders - Alcantara</title>
        <meta name="description" content="Track and manage your Alcantara orders" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FiPackage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <button
                  onClick={() => router.push('/products')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order {order.order_number}</h3>
                        <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${statusColors[order.status]}`}>
                          {React.createElement(statusIcons[order.status] || FiClock, { className: "h-4 w-4" })}
                          {order.status}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${paymentStatusColors[order.payment_status]}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Products Preview */}
                    <div className="mb-4">
                      <div className="flex items-center gap-4">
                        {order.order_items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                            {item.product_name?.charAt(0) || 'P'}
                          </div>
                        ))}
                        {order.order_items?.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-600">+{order.order_items.length - 3}</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            {order.order_items?.length || 0} item{(order.order_items?.length || 0) > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Total: {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Status Tracker */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Order Status</h4>
                      <OrderStatusTracker status={order.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-sm text-gray-500">
                        Order ID: <span className="font-medium text-gray-900">{order.order_number}</span>
                      </div>
                      <button
                        onClick={() => handleOrderDetails(order)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiArrowLeft className="h-6 w-6" />
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-medium">{selectedOrder.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColors[selectedOrder.status]}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${paymentStatusColors[selectedOrder.payment_status]}`}>
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">
                      {selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}
                    </div>
                    <div>{selectedOrder.shipping_address?.address}</div>
                    {selectedOrder.shipping_address?.apartment && (
                      <div>{selectedOrder.shipping_address.apartment}</div>
                    )}
                    <div>
                      {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zipCode}
                    </div>
                    <div>{selectedOrder.shipping_address?.country}</div>
                    <div>{selectedOrder.shipping_address?.phone}</div>
                    <div>{selectedOrder.shipping_address?.email}</div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
                <div className="space-y-4">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        {item.product_name?.charAt(0) || 'P'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                        <div className="text-sm text-gray-500">
                          {item.selected_color && <span>Color: {item.selected_color}</span>}
                          {item.selected_size && <span className="ml-2">Size: {item.selected_size}</span>}
                        </div>
                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(item.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Status Tracker */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                <OrderStatusTracker status={selectedOrder.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

// Server-side authentication check
export async function getServerSideProps(context) {
  return await getServerSideAuth(context);
}
