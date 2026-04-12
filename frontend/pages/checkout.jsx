import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useCart } from '../contexts/CartContext';
import InquiryForm from '../components/InquiryForm';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';
import { 
  CreditCard, 
  Truck, 
  Shield, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
  Lock,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  
  // State variables first
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [error, setError] = useState(null);
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
    console.log('Checkout - Cart context loaded successfully');
  } catch (error) {
    console.error('Checkout - Cart context error:', error);
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

  // Use local cart to avoid API errors
  const currentCartItems = cartItems || [];
  
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
    country: 'United States'
  });

  // Cleanup effect to prevent state updates after unmount
  useEffect(() => {
    console.log('Checkout - Cleanup useEffect mounted');
    return () => {
      console.log('Checkout - Cleanup useEffect cleanup');
      isMounted.current = false;
    };
  }, []);

  
  // Client-side authentication check - with debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Checkout page - Authentication check');
      console.log('isAuthenticated function available:', typeof isAuthenticated);
      
      // Add a small delay to ensure auth context is fully loaded
      const timer = setTimeout(() => {
        try {
          const authenticated = isAuthenticated();
          console.log('User authenticated:', authenticated);
          console.log('User email:', user?.email);
          console.log('User object:', user);
          
          // Set auth loading to false after check
          setAuthLoading(false);
          
          // More robust authentication check
          const isLoggedIn = authenticated && user;
          console.log('Is user logged in:', isLoggedIn);
          
          if (!isLoggedIn) {
            console.log('User not authenticated, redirecting to login...');
            router.push('/login?redirect=/checkout');
          } else {
            console.log('User is authenticated, showing checkout page');
          }
        } catch (error) {
          console.error('Authentication check error:', error);
          setError('Authentication check failed: ' + error.message);
          setAuthLoading(false);
        }
      }, 100); // Small delay to ensure context is loaded
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, router]);

  // Pre-fill shipping info from user when authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user?.user_metadata?.name?.split(' ')[0] || '',
        lastName: user?.user_metadata?.name?.split(' ')[1] || '',
        email: user?.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Don't redirect, just close the modal and stay on checkout
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  });

  // Calculate order totals from cart items
  const calculateLocalSubtotal = useCallback(() => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const calculateTax = useCallback(() => {
    const subtotal = isAuthenticated() ? calculateSubtotal() : calculateLocalSubtotal();
    return subtotal * 0.18; // 18% GST
  }, [isAuthenticated, calculateSubtotal, calculateLocalSubtotal]);

  const calculateShipping = useCallback(() => {
    const subtotal = isAuthenticated() ? calculateSubtotal() : calculateLocalSubtotal();
    return subtotal > 1000 ? 0 : 50; // Free shipping above 1000
  }, [isAuthenticated, calculateSubtotal, calculateLocalSubtotal]);

  const calculateTotal = useCallback(() => {
    const subtotal = isAuthenticated() ? calculateSubtotal() : calculateLocalSubtotal();
    return subtotal + calculateTax() + calculateShipping();
  }, [isAuthenticated, calculateSubtotal, calculateLocalSubtotal, calculateTax, calculateShipping]);

  const validateShippingInfo = useCallback(() => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field].trim() !== '');
  }, [shippingInfo]);

  const validateBillingInfo = useCallback(() => {
    if (billingInfo.sameAsShipping) return true;
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => billingInfo[field].trim() !== '');
  }, [billingInfo]);

  const validatePaymentInfo = useCallback(() => {
    // Make payment validation less strict for testing
    // Allow empty payment info for now since this is a test environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Checkout - Payment validation bypassed for development');
      return true;
    }

    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const isValid = required.every(field => paymentInfo[field].trim() !== '');
    
    // Debug: Log payment validation
    if (process.env.NODE_ENV === 'development') {
      console.log('Checkout - Payment validation:', {
        paymentInfo,
        isValid,
        requiredFields: required.map(field => ({
          field,
          value: paymentInfo[field],
          isEmpty: !paymentInfo[field].trim()
        }))
      });
    }
    
    return isValid;
  }, [paymentInfo]);

  const handleNextStep = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Next step clicked, current step:', step);
    }
    
    if (step === 1 && !validateShippingInfo()) {
      alert('Please fill in all required shipping information');
      return;
    }
    if (step === 2 && !validateBillingInfo()) {
      alert('Please fill in all required billing information');
      return;
    }
    if (step === 3 && !validatePaymentInfo()) {
      alert('Please fill in all required payment information');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  }, [step, validateShippingInfo, validateBillingInfo, validatePaymentInfo]);

  const handlePrevStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const handlePlaceOrder = useCallback(async () => {
    console.log('Checkout - handlePlaceOrder called');
    if (!isMounted.current) {
      console.log('Checkout - Component not mounted, returning');
      return;
    }
    
    console.log('Checkout - Setting loading to true');
    setLoading(true);
    
    try {
      // Debug: Log the current state
      if (process.env.NODE_ENV === 'development') {
        console.log('Checkout - Placing order with data:', {
          cartItems,
          shippingInfo,
          billingInfo,
          paymentInfo,
          currentStep: step
        });
      }
      
      // Check if cart has items
      console.log('Checkout - Checking cart items:', currentCartItems);
      if (!currentCartItems || !Array.isArray(currentCartItems) || currentCartItems.length === 0) {
        console.log('Checkout - Cart is empty or invalid');
        alert('Your cart is empty');
        if (isMounted.current) setLoading(false);
        return;
      }
      console.log('Checkout - Cart has items:', currentCartItems.length);

      // Validate all information before placing order
      console.log('Checkout - Validating shipping info...');
      const shippingValid = validateShippingInfo();
      console.log('Checkout - Shipping validation result:', shippingValid);
      if (!shippingValid) {
        console.log('Checkout - Shipping validation failed:', shippingInfo);
        alert('Please fill in all required shipping information');
        if (isMounted.current) setLoading(false);
        return;
      }

      console.log('Checkout - Validating billing info...');
      const billingValid = validateBillingInfo();
      console.log('Checkout - Billing validation result:', billingValid);
      if (!billingValid) {
        console.log('Checkout - Billing validation failed:', billingInfo);
        alert('Please fill in all required billing information');
        if (isMounted.current) setLoading(false);
        return;
      }

      console.log('Checkout - Validating payment info...');
      const paymentValid = validatePaymentInfo();
      console.log('Checkout - Payment validation result:', paymentValid);
      if (!paymentValid) {
        console.log('Checkout - Payment validation failed:', paymentInfo);
        alert('Please fill in all required payment information');
        if (isMounted.current) setLoading(false);
        return;
      }

      console.log('Checkout - All validations passed, preparing order data...');

      // Prepare order data using current cart items
      const orderData = {
        products: (currentCartItems || []).map(item => ({
          productId: item.id,
          name: item.products?.name || item.name || `Product ${item.id}`,
          price: item.products?.price || item.price || item.final_price || 1000,
          quantity: item.quantity,
          image: item.products?.images?.[0] || item.image || '/images/products/default.jpg',
          variant: {
            color: item.selected_color || item.variant?.color || 'Standard',
            size: item.selected_size || item.variant?.size || 'Standard'
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
          phone: shippingInfo.phone,
          email: shippingInfo.email
        },
        paymentMethod: 'Credit Card',
        paymentDetails: {
          paidAt: new Date().toISOString(),
          transactionId: 'TXN' + Date.now()
        },
        notes: 'Order placed from checkout'
      };

      // Debug: Log the complete order data
      if (process.env.NODE_ENV === 'development') {
        console.log('Checkout - Complete order data being sent:', JSON.stringify(orderData, null, 2));
      }

      // Create order via API
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/orders`;
      console.log('Checkout - Environment variable NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Checkout - Making API call to:', apiUrl);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Checkout - API response status:', response.status);
      console.log('Checkout - API response headers:', response.headers);
      
      const result = await response.json();
      console.log('Checkout - Parsed API response:', result);

      // Debug: Log the API response
      if (process.env.NODE_ENV === 'development') {
        console.log('Checkout - API response:', result);
        console.log('Checkout - Response status:', response.status);
      }

      // Log error details if failed
      if (!result.success) {
        console.error('Checkout - API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          message: result.message,
          error: result.error,
          fullResponse: result
        });
      }

      if (result.success) {
        // Clear cart using CartContext
        clearCart();
        // Store order info for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(result.data));
        // Redirect to order confirmation only if component is still mounted
        if (isMounted.current) {
          router.push('/order-confirmation');
        }
      } else {
        if (isMounted.current) {
          alert('Failed to place order: ' + (result.message || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (isMounted.current) {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [currentCartItems, shippingInfo, billingInfo, paymentInfo, step, validateShippingInfo, validateBillingInfo, validatePaymentInfo, clearCart, router]);

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Billing', icon: Building2 },
    { id: 3, name: 'Payment', icon: CreditCard },
    { id: 4, name: 'Review', icon: Check }
  ];

  // Show loading while checking authentication (but don't block the page)
  if (authLoading) {
    // Don't return loading screen, let the page load and handle auth in useEffect
    console.log('Checkout - Auth loading, but continuing to render page');
  }

  // Show error if any
  if (error) {
    return (
      <Layout title="Checkout">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h1>
            <p className="text-gray-600 mb-6">There was an error loading the checkout page.</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Early return for empty cart - AFTER all hooks are defined
  const totalItems = isAuthenticated() ? calculateTotalItems() : (cartItems?.length || 0);
  if (totalItems === 0) {
    return (
      <Layout title="Checkout">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, useEffect will redirect to login page
  // No need for authentication gate here

  return (
    <Layout title="Checkout">
      <div className="bg-gray-50 py-4 sm:py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {steps.map((stepItem, index) => (
                  <div key={stepItem.id} className="flex items-center w-full sm:w-auto">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        step >= stepItem.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step > stepItem.id ? (
                          <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                        ) : (
                          <stepItem.icon className="w-3 h-3 sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <span className={`ml-2 text-xs sm:text-sm font-medium ${
                        step >= stepItem.id ? 'text-primary-600' : 'text-gray-500'
                      }`}>
                        {stepItem.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Shipping Information</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.company}
                          onChange={(e) => setShippingInfo({...shippingInfo, company: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                          placeholder="Company (Optional)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                          placeholder="email@example.com"
                          autoComplete="email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                          placeholder="(555) 123-4567"
                          autoComplete="tel"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                          placeholder="123 Main Street"
                          rows={3}
                          autoComplete="street-address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.state}
                            onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.zipCode}
                            onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="12345"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Billing Information */}
                {step === 2 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Billing Information</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sameAsShipping"
                          checked={billingInfo.sameAsShipping}
                          onChange={(e) => setBillingInfo({...billingInfo, sameAsShipping: e.target.checked})}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                          Same as shipping address
                        </label>
                      </div>
                      
                      {!billingInfo.sameAsShipping && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={billingInfo.firstName}
                                onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                                placeholder="First Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={billingInfo.lastName}
                                onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                                placeholder="Last Name"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company Name
                            </label>
                            <input
                              type="text"
                              value={billingInfo.company}
                              onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                              placeholder="Company (Optional)"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={billingInfo.email}
                              onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                              placeholder="email@example.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={billingInfo.phone}
                              onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Billing Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={billingInfo.address}
                              onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                              rows={3}
                              placeholder="123 Main Street"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={billingInfo.city}
                                onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={billingInfo.state}
                                onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={billingInfo.zipCode}
                                onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="12345"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={billingInfo.country}
                              onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Country"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Information */}
                {step === 3 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Payment Information</h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Payment Method</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="credit-card"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Credit Card</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                            placeholder="1234 5678 9012 3456"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                              placeholder="MM/YY"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus: ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                              placeholder="123"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus: ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cardName}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                            placeholder="John Doe"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus: ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="saveCard"
                            checked={paymentInfo.saveCard}
                            onChange={(e) => setPaymentInfo({...paymentInfo, saveCard: e.target.checked})}
                            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                          />
                          <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">Save card information for future purchases</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review Order */}
                {step === 4 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Review Your Order</h2>
                    
                    <div className="space-y-4">
                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Order Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="text-sm font-medium">Rs. {calculateLocalSubtotal()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tax (18%)</span>
                            <span className="text-sm font-medium">Rs. {calculateTax()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Shipping</span>
                            <span className="text-sm font-medium">Rs. {calculateShipping()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="text-lg font-bold text-primary-600">Rs. {calculateTotal()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Order Items</h3>
                        <div className="space-y-3">
                          {currentCartItems.map((item, index) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                              <img
                                src={item.image || '/images/products/default.jpg'}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = '/images/products/default.jpg';
                                }}
                              />
                              <div className="flex-1">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  <p className="text-sm font-medium text-primary-600">Rs. {item.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shipping Address */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Shipping Address</h3>
                        <div className="text-sm text-gray-600">
                          <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                          {shippingInfo.company && <p>{shippingInfo.company}</p>}
                          <p>{shippingInfo.address}</p>
                          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                          <p>{shippingInfo.country}</p>
                          <p>{shippingInfo.phone}</p>
                          <p>{shippingInfo.email}</p>
                        </div>
                      </div>
                      
                      {/* Billing Address */}
                      {!billingInfo.sameAsShipping && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-4">Billing Address</h3>
                          <div className="text-sm text-gray-600">
                            <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                            {billingInfo.company && <p>{billingInfo.company}</p>}
                            <p>{billingInfo.address}</p>
                            <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                            <p>{billingInfo.country}</p>
                            <p>{billingInfo.phone}</p>
                            <p>{billingInfo.email}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Payment Method</h3>
                        <div className="text-sm text-gray-600">
                          <p>Credit Card ending in {paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : '****'}</p>
                          <p>{paymentInfo.cardName || 'Cardholder'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Terms & Conditions</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          By placing this order, you agree to our Terms of Service and Privacy Policy. Your order will be processed securely and your personal information will be protected.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 mb-24 lg:mb-0">
                  <button
                    onClick={handlePrevStep}
                    disabled={step === 1}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Place Order</span>
                          </>
                        )}
                      </button>
                      
                      // Debug test button */
                      <button
                        onClick={async () => {
                          console.log('Checkout - DEBUG: Test API call directly');
                          try {
                            const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/orders`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                products: [{
                                  productId: 'debug-test',
                                  name: 'Debug Test Product',
                                  price: 999,
                                  quantity: 1
                                }],
                                shippingAddress: {
                                  firstName: 'Debug',
                                  lastName: 'Test',
                                  email: 'debug@test.com',
                                  phone: '1234567890',
                                  address: '123 Debug St',
                                  city: 'Debug City',
                                  state: 'Debug State',
                                  postalCode: '12345',
                                  country: 'Debug Country'
                                },
                                paymentMethod: 'Credit Card',
                                paymentDetails: {
                                  paidAt: new Date().toISOString(),
                                  transactionId: 'DEBUG-' + Date.now()
                                },
                                notes: 'Debug test from checkout page'
                              })
                            });
                            
                            const testResult = await testResponse.json();
                            console.log('Checkout - DEBUG: Test API response:', testResult);
                            alert('Debug test: ' + (testResult.success ? 'SUCCESS' : 'FAILED: ' + testResult.error));
                          } catch (error) {
                            console.error('Checkout - DEBUG: Test API error:', error);
                            alert('Debug test error: ' + error.message);
                          }
                        }}
                        className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <span>Debug Test API</span>
                      </button>
                    </>
                  )}
                  
                </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium">Rs. {calculateLocalSubtotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax (18%)</span>
                      <span className="text-sm font-medium">Rs. {calculateTax()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="text-sm font-medium">Rs. {calculateShipping()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-lg font-bold text-primary-600">Rs. {calculateTotal()}</span>
                    </div>
                  </div>
                  
                  {/* Cart Items */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Cart Items ({currentCartItems.length})</h3>
                    <div className="space-y-3">
                      {currentCartItems.map((item, index) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                          <img
                            src={item.image || '/images/products/default.jpg'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/images/products/default.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium text-primary-600">Rs. {item.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mobile Spacer to prevent content overlap */}
                  <div className="lg:hidden h-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default CheckoutPage;
