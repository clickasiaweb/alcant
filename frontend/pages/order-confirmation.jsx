import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Check, Package, Truck, Mail, Phone, ArrowRight } from 'lucide-react';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { order_id } = router.query;

  // Mock order data
  const orderData = {
    id: order_id || 'ORD-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString(),
    status: 'Processing',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      {
        id: 1,
        name: 'Premium Industrial Automation System',
        price: 25000,
        quantity: 1,
        image: 'https://via.placeholder.com/60x60/1a365d/ffffff?text=Automation'
      },
      {
        id: 2,
        name: 'Quality Control System',
        price: 15000,
        quantity: 2,
        image: 'https://via.placeholder.com/60x60/2b6cb0/ffffff?text=QC'
      },
      {
        id: 3,
        name: 'Industrial Robot Arm',
        price: 45000,
        quantity: 1,
        image: 'https://via.placeholder.com/60x60/3182ce/ffffff?text=Robot'
      }
    ],
    shipping: {
      name: 'John Doe',
      address: '123 Industrial Park Drive',
      city: 'Manufacturing City',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    },
    payment: {
      method: 'Credit Card',
      lastFour: '1234',
      total: 100000
    }
  };

  const calculateSubtotal = () => {
    return orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 10000 ? 0 : 500;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout title="Order Confirmation">
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Order Confirmed!
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
                <p className="text-gray-600 mb-6">
                  Order ID: <span className="font-semibold">{orderData.id}</span>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Print Receipt
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{orderData.shipping.name}</p>
                        <p>{orderData.shipping.address}</p>
                        <p>{orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}</p>
                        <p>{orderData.shipping.country}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Delivery Details</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Status: <span className="font-medium text-green-600">{orderData.status}</span></p>
                        <p>Estimated Delivery: <span className="font-medium">{orderData.estimatedDelivery}</span></p>
                        <p>Shipping Method: <span className="font-medium">Standard</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{orderData.payment.method}</p>
                        <p>Ending in {orderData.payment.lastFour}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Subtotal: <span className="font-medium">${calculateSubtotal().toLocaleString()}</span></p>
                        <p>Tax: <span className="font-medium">${calculateTax().toLocaleString()}</span></p>
                        <p>Shipping: <span className="font-medium">{calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toLocaleString()}`}</span></p>
                        <p className="font-semibold text-gray-900 pt-2 border-t">Total: <span className="font-semibold">${calculateTotal().toLocaleString()}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Order Timeline */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order Placed</p>
                        <p className="text-sm text-gray-600">{orderData.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Processing</p>
                        <p className="text-sm text-gray-600">In progress</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">Shipped</p>
                        <p className="text-sm text-gray-400">Pending</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-400">Delivered</p>
                        <p className="text-sm text-gray-400">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Support */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                  <div className="space-y-3">
                    <a
                      href="tel:+1-800-123-4567"
                      className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">1-800-123-4567</span>
                    </a>
                    <a
                      href="mailto:support@example.com"
                      className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">support@example.com</span>
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Our customer support team is available Monday-Friday, 9 AM - 6 PM EST.
                  </p>
                </div>

                {/* What's Next */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                  <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>You'll receive an order confirmation email shortly</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>We'll process your order within 1-2 business days</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>You'll receive tracking information once shipped</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Your order will be delivered by {orderData.estimatedDelivery}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
