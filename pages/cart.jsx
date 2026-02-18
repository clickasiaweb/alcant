import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  Trash2, 
  ChevronRight,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Mock cart data
  const mockCartItems = [
    {
      id: 1,
      name: 'Premium Industrial Automation System',
      slug: 'premium-industrial-automation-system',
      price: 25000,
      originalPrice: 28000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100/1a365d/ffffff?text=Automation',
      category: 'Automation',
      inStock: true,
      variant: 'Standard Model'
    },
    {
      id: 2,
      name: 'Quality Control System',
      slug: 'quality-control-system',
      price: 15000,
      quantity: 2,
      image: 'https://via.placeholder.com/100x100/2b6cb0/ffffff?text=QC',
      category: 'Quality Control',
      inStock: true,
      variant: 'Professional Model'
    },
    {
      id: 3,
      name: 'Industrial Robot Arm',
      slug: 'industrial-robot-arm',
      price: 45000,
      originalPrice: 50000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100/3182ce/ffffff?text=Robot',
      category: 'Robotics',
      inStock: true,
      variant: 'Standard Model'
    }
  ];

  useEffect(() => {
    // Simulate loading cart data
    const loadCart = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCartItems(mockCartItems);
      setLoading(false);
    };
    
    loadCart();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.originalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (discount / 100);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    return (subtotal - discountAmount) * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discountAmount + tax;
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
    } else if (promoCode.toUpperCase() === 'WELCOME20') {
      setDiscount(20);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout');
  };

  if (loading) {
    return (
      <Layout title="Shopping Cart">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart">
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <div className="flex items-center text-gray-600">
                <ShoppingBag className="w-5 h-5 mr-2" />
                <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                              <p className="text-sm text-gray-500 mb-2">{item.variant}</p>
                              
                              {/* Quantity Selector */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ${(item.price * item.quantity).toLocaleString()}
                              </div>
                              {item.originalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${(item.originalPrice * item.quantity).toLocaleString()}
                                </div>
                              )}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="mt-2 text-red-500 hover:text-red-600 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                    
                    {/* Pricing */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${calculateSubtotal().toLocaleString()}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({discount}%)</span>
                          <span>-${calculateDiscount().toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>${calculateTax().toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-semibold text-gray-900">
                          <span>Total</span>
                          <span>${calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promo Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4 text-primary-600" />
                        <span>Free shipping on orders over $10,000</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-primary-600" />
                        <span>Secure checkout</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Checkout</span>
                    </button>

                    {/* Continue Shopping */}
                    <button
                      onClick={() => router.push('/products')}
                      className="w-full mt-3 text-center text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
