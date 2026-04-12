import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useCart } from '../contexts/CartContext';

const CheckoutDebugPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const isMounted = useRef(true);
  
  // Handle auth context with fallback
  let authContext;
  try {
    authContext = useSupabaseAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    setError('Authentication context error');
    authContext = {
      isAuthenticated: () => false,
      user: null,
      getFullName: () => 'Guest'
    };
  }
  const { isAuthenticated, user, getFullName } = authContext;
  
  // Handle cart context with fallback
  let cartContext;
  try {
    cartContext = useCart();
    console.log('Checkout Debug - Cart context loaded successfully');
  } catch (error) {
    console.error('Checkout Debug - Cart context error:', error);
    setError('Cart context error');
    cartContext = {
      cartItems: [],
      isCartOpen: false,
      closeCart: () => {},
      updateQuantity: () => {},
      removeItem: () => {},
      crossSellProducts: [],
      addToCart: () => {},
      calculateSubtotal: () => 0,
      calculateTotalItems: () => 0,
      clearCart: async () => {}
    };
  }
  const { cartItems, calculateSubtotal, calculateTotalItems, clearCart } = cartContext;

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    sameAsShipping: true
  });

  // Debug functions
  const validateShippingInfo = () => {
    return shippingInfo.firstName && shippingInfo.lastName && shippingInfo.email && shippingInfo.phone && shippingInfo.address && shippingInfo.city && shippingInfo.state && shippingInfo.zipCode && shippingInfo.country;
  };

  const validateBillingInfo = () => {
    if (billingInfo.sameAsShipping) return true;
    return billingInfo.firstName && billingInfo.lastName && billingInfo.email && billingInfo.phone && billingInfo.address && billingInfo.city && billingInfo.state && billingInfo.zipCode && billingInfo.country;
  };

  const validatePaymentInfo = () => {
    return true; // For testing, always valid
  };

  // Test order placement
  const handlePlaceOrder = useCallback(async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Checkout Debug - Placing order...');
      
      // Check if cart has items
      const currentCartItems = cartItems || [];
      if (!Array.isArray(currentCartItems) || currentCartItems.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      // Validate all information
      if (!validateShippingInfo()) {
        setError('Please fill in all required shipping information');
        setLoading(false);
        return;
      }

      if (!validateBillingInfo()) {
        setError('Please fill in all required billing information');
        setLoading(false);
        return;
      }

      if (!validatePaymentInfo()) {
        setError('Please fill in all required payment information');
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        products: currentCartItems.map(item => ({
          productId: item.id,
          name: item.name || `Product ${item.id}`,
          price: item.price || item.final_price || 1000,
          quantity: item.quantity,
          image: item.image || '/images/products/default.jpg',
          variant: {
            color: item.selected_color || 'Standard',
            size: item.selected_size || 'Standard'
          }
        })),
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          company: shippingInfo.company,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
          email: shippingInfo.email
        },
        billingAddress: billingInfo.sameAsShipping ? undefined : {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          company: billingInfo.company,
          address: billingInfo.address,
          city: billingInfo.city,
          state: billingInfo.state,
          postalCode: billingInfo.zipCode,
          country: billingInfo.country,
          phone: billingInfo.phone,
          email: billingInfo.email
        },
        paymentMethod: 'Credit Card',
        paymentDetails: {
          paidAt: new Date().toISOString(),
          transactionId: 'TXN' + Date.now()
        },
        notes: 'Test order from checkout debug page'
      };

      console.log('Checkout Debug - Order data:', JSON.stringify(orderData, null, 2));

      // Create order via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      console.log('Checkout Debug - API response:', result);
      console.log('Checkout Debug - Response status:', response.status);

      if (result.success) {
        // Clear cart
        clearCart();
        // Store order info
        localStorage.setItem('lastOrder', JSON.stringify(result.data));
        setDebugInfo({
          success: true,
          orderId: result.data.order_id,
          orderNumber: result.data.order_number,
          message: 'Order placed successfully'
        });
        
        if (isMounted.current) {
          setTimeout(() => {
            router.push('/order-confirmation');
          }, 1000);
        }
      } else {
        setError('Failed to place order: ' + (result.message || 'Unknown error'));
        setDebugInfo({
          success: false,
          error: result.error || 'Unknown error'
        });
      }
    } catch (error) {
      console.error('Checkout Debug - Error placing order:', error);
      setError('Failed to place order. Please try again.');
      setDebugInfo({
        success: false,
        error: error.message
      });
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [cartItems, shippingInfo, billingInfo, clearCart, router]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Layout title="Checkout Debug">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout Debug Page</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Debug Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Authentication Status</h3>
                    <p className="text-sm text-gray-600">
                      Authenticated: {isAuthenticated() ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm text-gray-600">
                      User: {user?.email || 'Not logged in'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Cart Information</h3>
                    <p className="text-sm text-gray-600">
                      Cart Items: {Array.isArray(cartItems) ? cartItems.length : 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Items: {calculateTotalItems()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Subtotal: Rs. {calculateSubtotal()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Order Status</h3>
                    {loading && <p className="text-sm text-blue-600">Processing order...</p>}
                    {error && <p className="text-sm text-red-600">Error: {error}</p>}
                    {debugInfo.success && (
                      <div className="text-sm text-green-600">
                        <p>✅ Order placed successfully!</p>
                        <p>Order ID: {debugInfo.orderId}</p>
                        <p>Order Number: {debugInfo.orderNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Test Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Order Form</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="First Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Last Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="12345"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Country"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Test Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutDebugPage;
