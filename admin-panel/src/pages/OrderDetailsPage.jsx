import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiPackage, 
  FiUser, 
  FiMapPin, 
  FiCreditCard, 
  FiTruck,
  FiCalendar,
  FiDollarSign,
  FiEdit2,
  FiSave,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiXCircle
} from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
  'Cancelled': FiXCircle
};

const paymentStatusColors = {
  'Paid': 'bg-green-100 text-green-800 border-green-200',
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Failed': 'bg-red-100 text-red-800 border-red-200',
  'Refunded': 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingTracking, setEditingTracking] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newTrackingId, setNewTrackingId] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
        setNewStatus(data.data.order_status);
        setNewTrackingId(data.data.tracking_id || '');
      } else {
        throw new Error(data.message || 'Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(error.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          note: statusNote,
          trackingId: newTrackingId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrder(data.data);
        setEditingStatus(false);
        setStatusNote('');
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newPaymentStatus,
          paymentDetails: {
            paidAt: newPaymentStatus === 'Paid' ? new Date().toISOString() : null
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Payment status updated to ${newPaymentStatus}`);
        setOrder(data.data);
      } else {
        throw new Error(data.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
    }
  };

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

  const StatusIcon = order?.order_status ? statusIcons[order.order_status] : FiClock;

  if (loading) {
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">Order not found</p>
            <p className="text-gray-500">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft />
              Back to Orders
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-gray-600">Order ID: {order.order_id}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border ${statusColors[order.order_status]}`}>
                <StatusIcon className="h-4 w-4" />
                {order.order_status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                {!editingStatus && (
                  <button
                    onClick={() => setEditingStatus(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingStatus ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking ID
                    </label>
                    <input
                      type="text"
                      value={newTrackingId}
                      onChange={(e) => setNewTrackingId(e.target.value)}
                      placeholder="Enter tracking ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note (optional)
                    </label>
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this status change"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStatusUpdate}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiSave />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingStatus(false);
                        setNewStatus(order.order_status);
                        setNewTrackingId(order.tracking_id || '');
                        setStatusNote('');
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiX />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${statusColors[order.order_status]}`}>
                      <StatusIcon className="h-4 w-4" />
                      {order.order_status}
                    </span>
                    {order.tracking_id && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Tracking ID:</span> {order.tracking_id}
                      </div>
                    )}
                  </div>

                  {/* Status History */}
                  {order.status_history && order.status_history.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Status History</h3>
                      <div className="space-y-2">
                        {order.status_history.map((history, index) => {
                          const HistoryIcon = statusIcons[history.status] || FiClock;
                          return (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              <HistoryIcon className="h-4 w-4 text-gray-400" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{history.status}</div>
                                <div className="text-gray-500">{formatDate(history.timestamp)}</div>
                                {history.note && (
                                  <div className="text-gray-600 text-xs mt-1">{history.note}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <div className="text-sm text-gray-500">
                        {product.variant?.color && <span>Color: {product.variant.color}</span>}
                        {product.variant?.size && <span className="ml-2">Size: {product.variant.size}</span>}
                      </div>
                      <div className="text-sm text-gray-500">Qty: {product.quantity}</div>
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

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Order Placed</div>
                    <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                  </div>
                </div>
                
                {order.estimated_delivery && (
                  <div className="flex items-center gap-4">
                    <FiTruck className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Estimated Delivery</div>
                      <div className="text-sm text-gray-500">{formatDate(order.estimated_delivery)}</div>
                    </div>
                  </div>
                )}

                {order.actual_delivery && (
                  <div className="flex items-center gap-4">
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">Delivered</div>
                      <div className="text-sm text-gray-500">{formatDate(order.actual_delivery)}</div>
                    </div>
                  </div>
                )}

                {order.cancelled_at && (
                  <div className="flex items-center gap-4">
                    <FiXCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900">Cancelled</div>
                      <div className="text-sm text-gray-500">{formatDate(order.cancelled_at)}</div>
                      {order.cancellation_reason && (
                        <div className="text-sm text-red-600 mt-1">Reason: {order.cancellation_reason}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Customer Info</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">
                    {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{order.shipping_address?.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium text-gray-900">{order.shipping_address?.phone}</div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-gray-900">
                  {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                </div>
                {order.shipping_address?.company && (
                  <div className="text-gray-600">{order.shipping_address.company}</div>
                )}
                <div className="text-gray-600">{order.shipping_address?.address}</div>
                {order.shipping_address?.apartment && (
                  <div className="text-gray-600">{order.shipping_address.apartment}</div>
                )}
                <div className="text-gray-600">
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postalCode}
                </div>
                <div className="text-gray-600">{order.shipping_address?.country}</div>
                <div className="text-gray-600">{order.shipping_address?.phone}</div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Info</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="font-medium text-gray-900">{order.payment_method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <select
                    value={order.payment_status}
                    onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
                    className={`text-xs font-medium rounded-full border px-2 py-1 cursor-pointer ${paymentStatusColors[order.payment_status]}`}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                {order.paymentDetails?.transactionId && (
                  <div>
                    <div className="text-sm text-gray-500">Transaction ID</div>
                    <div className="font-medium text-gray-900">{order.paymentDetails.transactionId}</div>
                  </div>
                )}
                {order.paymentDetails?.paidAt && (
                  <div>
                    <div className="text-sm text-gray-500">Paid At</div>
                    <div className="font-medium text-gray-900">{formatDate(order.paymentDetails.paidAt)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
