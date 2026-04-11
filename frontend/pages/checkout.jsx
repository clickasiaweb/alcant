import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useSupabaseCart } from '../contexts/SupabaseCartContext';
import InquiryForm from '../components/InquiryForm';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';
import { getServerSideAuth } from '../lib/serverAuth';
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

const CheckoutPage = ({ user: serverUser, isAuthenticated: serverIsAuthenticated }) => {
  const router = useRouter();
  
  // State variables first
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const isMounted = useRef(true);
  
  // Handle auth context with fallback
  let authContext;
  try {
    authContext = useSupabaseAuth();
  } catch (error) {
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
    cartContext = useSupabaseCart();
  } catch (error) {
    cartContext = {
      cartItems: [],
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

  // Debug: Log shipping info changes - REMOVED to prevent infinite re-renders
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('Checkout - shippingInfo updated:', shippingInfo);
  //   }
  // }, [shippingInfo]);

  // Cleanup effect to prevent state updates after unmount
  useEffect(() => {
    console.log('Checkout - Cleanup useEffect mounted');
    return () => {
      console.log('Checkout - Cleanup useEffect cleanup');
      isMounted.current = false;
    };
  }, []);

  
  // Client-side authentication check - simple logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Simple logic: if not authenticated, redirect to login page
      if (!isAuthenticated()) {
        router.push('/login?redirect=/checkout');
      }
    }
  }, [isAuthenticated, router]);

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
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const isValid = required.every(field => paymentInfo[field].trim() !== '');
    
    // Debug: Log payment validation
    if (process.env.NODE_ENV === 'development') {
      console.log('Payment validation:', {
        paymentInfo,
        required,
        isValid,
        emptyFields: required.filter(field => !paymentInfo[field].trim())
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
    if (!isMounted.current) return;
    
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
      if (!currentCartItems || !Array.isArray(currentCartItems) || currentCartItems.length === 0) {
        alert('Your cart is empty');
        if (isMounted.current) setLoading(false);
        return;
      }

      // Validate all information before placing order
      if (!validateShippingInfo()) {
        alert('Please fill in all required shipping information');
        if (isMounted.current) setLoading(false);
        return;
      }

      if (!validateBillingInfo()) {
        alert('Please fill in all required billing information');
        if (isMounted.current) setLoading(false);
        return;
      }

      if (!validatePaymentInfo()) {
        alert('Please fill in all required payment information');
        if (isMounted.current) setLoading(false);
        return;
      }

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      // Debug: Log the API response
      if (process.env.NODE_ENV === 'development') {
        console.log('Checkout - API response:', result);
        console.log('Checkout - Response status:', response.status);
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
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:flex flex-1 h-0.5 mx-4 ${
                        step > stepItem.id ? 'bg-primary-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Shipping Information</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
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
                          Last Name *
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

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.company}
                        onChange={(e) => setShippingInfo({...shippingInfo, company: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                        placeholder="Company (Optional)"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
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
                          Phone *
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
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
                        placeholder="123 Main Street"
                        autoComplete="street-address"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
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
                          State *
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
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Billing Information */}
                {step === 2 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Billing Information</h2>
                    
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={billingInfo.sameAsShipping}
                          onChange={(e) => setBillingInfo({...billingInfo, sameAsShipping: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Same as shipping address</span>
                      </label>
                    </div>

                    {!billingInfo.sameAsShipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.firstName}
                              onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.lastName}
                              onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={billingInfo.company}
                            onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.address}
                            onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.city}
                              onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.state}
                              onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.zipCode}
                              onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Payment Information */}
                {step === 3 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Payment Information</h2>
                    
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Your payment information is secure and encrypted</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          placeholder="123"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={paymentInfo.saveCard}
                          onChange={(e) => setPaymentInfo({...paymentInfo, saveCard: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Save card for future purchases</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 4: Review Order */}
                {step === 4 && (
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Review Your Order</h2>
                    
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {currentCartItems && currentCartItems.length > 0 ? (
                          currentCartItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <img
                                src={item.products?.images?.[0] || item.image || '/images/products/default.jpg'}
                                alt={item.products?.name || item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.products?.name || item.name || 'Product'}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                                {(item.selected_color || item.variant?.color) && (
                                  <p className="text-xs text-gray-500">Color: {item.selected_color || item.variant?.color}</p>
                                )}
                              </div>
                              <p className="font-medium text-gray-900">
                                ${((item.products?.price || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <p>No items in cart</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-4">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        {shippingInfo.company && <p>{shippingInfo.company}</p>}
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        <p>Credit Card ending in {paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : '****'}</p>
                        <p>{paymentInfo.cardName || 'Cardholder'}</p>
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

                  {step < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${(isAuthenticated() ? calculateSubtotal() : calculateLocalSubtotal()).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-primary-600">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-primary-600" />
                      <span>Free shipping on orders over $10,000</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-primary-600" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary-600" />
                      <span>30-day return policy</span>
                    </div>
                  </div>

                  {/* Support Inquiry */}
                  <div className="border-t pt-4 mt-6">
                    <button
                      onClick={() => setShowInquiryModal(true)}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Need Help? Ask a Question</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Order Summary - Sticky Bottom */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">${calculateTotal().toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => setShowInquiryModal(true)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-3 h-3 text-primary-600" />
                        <span>{calculateShipping() === 0 ? 'FREE' : `$${calculateShipping()}`} Shipping</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-primary-600" />
                        <span>Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Spacer to prevent content overlap */}
                <div className="lg:hidden h-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <InquiryForm 
              onClose={() => setShowInquiryModal(false)}
              showTitle={true}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CheckoutPage;

// Server-side authentication check
export async function getServerSideProps(context) {
  return await getServerSideAuth(context);
}
