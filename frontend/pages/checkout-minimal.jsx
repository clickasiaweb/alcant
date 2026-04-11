import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const MinimalCheckoutPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkAuthAndLoadPage = async () => {
      try {
        console.log('Minimal checkout - Starting page load');
        
        // Simple authentication check using localStorage
        const token = localStorage.getItem('supabase.auth.token');
        const userStr = localStorage.getItem('supabase.auth.user');
        
        console.log('Token exists:', !!token);
        console.log('User exists:', !!userStr);
        
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserInfo(user);
          console.log('User info loaded:', user?.email);
        }
        
        setLoading(false);
        
        // If no user, redirect to login
        if (!token || !userStr) {
          console.log('No authentication found, redirecting to login');
          router.push('/login?redirect=/checkout');
        }
        
      } catch (error) {
        console.error('Minimal checkout error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    checkAuthAndLoadPage();
  }, [router]);

  if (loading) {
    return (
      <Layout title="Checkout">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading Checkout...</h1>
            <p className="text-gray-600">Please wait while we prepare your checkout.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Checkout Error">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout">
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
            
            {/* User Info Display */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {userInfo?.email || 'Not available'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">User ID:</span> {userInfo?.id || 'Not available'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span> 
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Authenticated
                  </span>
                </p>
              </div>
            </div>

            {/* Simple Checkout Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={userInfo?.email || ''}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Enter your shipping address"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Rs. 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Rs. 0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary-600">Rs. 0.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                onClick={() => alert('Order placement would be processed here')}
              >
                Place Order
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/cart')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Debug Information */}
            <div className="bg-gray-100 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h3>
              <pre className="text-xs text-gray-600">
                {JSON.stringify({
                  authenticated: !!userInfo,
                  userEmail: userInfo?.email,
                  userId: userInfo?.id,
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MinimalCheckoutPage;
