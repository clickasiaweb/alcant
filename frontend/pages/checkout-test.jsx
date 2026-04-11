import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useSupabaseCart } from '../contexts/SupabaseCartContext';

const CheckoutTestPage = () => {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPageStatus = async () => {
      try {
        console.log('Checkout test page loaded');
        
        // Check authentication
        let authStatus = 'Unknown';
        let userInfo = null;
        
        try {
          const auth = useSupabaseAuth();
          authStatus = auth.isAuthenticated() ? 'Authenticated' : 'Not Authenticated';
          userInfo = auth.user;
          console.log('Auth status:', authStatus, userInfo?.email);
        } catch (authError) {
          authStatus = 'Auth Error: ' + authError.message;
          console.error('Auth error:', authError);
        }

        // Check cart
        let cartStatus = 'Unknown';
        let cartItems = [];
        
        try {
          const cart = useSupabaseCart();
          cartItems = cart.cartItems || [];
          cartStatus = `Cart has ${cartItems.length} items`;
          console.log('Cart status:', cartStatus);
        } catch (cartError) {
          cartStatus = 'Cart Error: ' + cartError.message;
          console.error('Cart error:', cartError);
        }

        // Check router
        const routerInfo = {
          path: router.pathname,
          query: router.query,
          isReady: router.isReady
        };

        setDebugInfo({
          authStatus,
          userInfo: userInfo?.email || 'No user',
          cartStatus,
          cartItemCount: cartItems.length,
          routerInfo,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Debug error:', error);
        setError(error.message);
      }
    };

    checkPageStatus();
  }, [router]);

  if (error) {
    return (
      <Layout title="Checkout Test Error">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout Test">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Page Debug</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Authentication Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    debugInfo.authStatus?.includes('Authenticated') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo.authStatus}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">User Email:</span>
                  <span className="text-gray-600">{debugInfo.userInfo}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Cart Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    debugInfo.cartItemCount > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {debugInfo.cartStatus}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Current Path:</span>
                  <span className="text-gray-600">{debugInfo.routerInfo?.path}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Router Ready:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    debugInfo.routerInfo?.isReady 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo.routerInfo?.isReady ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Timestamp:</span>
                  <span className="text-gray-600">{debugInfo.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Go to Actual Checkout Page
                </button>
                
                <button
                  onClick={() => router.push('/cart')}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Cart
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Full Debug Data</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutTestPage;
