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
  FiRefreshCw
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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

export default function MyOrdersPage() {
  const router = useRouter();
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

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/my-orders?page=${pagination.page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // You might want to add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, router]);

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

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
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
                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order {order.orderId}</h3>
                        <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${statusColors[order.orderStatus]}`}>
                          {React.createElement(statusIcons[order.orderStatus] || FiClock, { className: "h-4 w-4" })}
                          {order.orderStatus}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${paymentStatusColors[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Products Preview */}
                    <div className="mb-4">
                      <div className="flex items-center gap-4">
                        {order.products.slice(0, 3).map((product, index) => (
                          <img
                            key={index}
                            src={product.image || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                        {order.products.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-600">+{order.products.length - 3}</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            {order.products.length} item{order.products.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Total: {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Status Tracker */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Order Status</h4>
                      <OrderStatusTracker status={order.orderStatus} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-sm text-gray-500">
                        {order.trackingId && (
                          <span>Tracking ID: <span className="font-medium text-gray-900">{order.trackingId}</span></span>
                        )}
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
                      <span className="font-medium">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColors[selectedOrder.orderStatus]}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${paymentStatusColors[selectedOrder.paymentStatus]}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    {selectedOrder.trackingId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tracking ID:</span>
                        <span className="font-medium">{selectedOrder.trackingId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">
                      {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                    </div>
                    <div>{selectedOrder.shippingAddress?.address}</div>
                    {selectedOrder.shippingAddress?.apartment && (
                      <div>{selectedOrder.shippingAddress.apartment}</div>
                    )}
                    <div>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                    </div>
                    <div>{selectedOrder.shippingAddress?.country}</div>
                    <div>{selectedOrder.shippingAddress?.phone}</div>
                    <div>{selectedOrder.shippingAddress?.email}</div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
                <div className="space-y-4">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <div className="text-sm text-gray-500">
                          {product.variant?.color && <span>Color: {product.variant.color}</span>}
                          {product.variant?.size && <span className="ml-2">Size: {product.variant.size}</span>}
                        </div>
                        <div className="text-sm text-gray-500">Quantity: {product.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(product.price * product.quantity)}
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
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Status Tracker */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                <OrderStatusTracker status={selectedOrder.orderStatus} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
