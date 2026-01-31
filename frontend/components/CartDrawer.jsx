import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Clock, 
  Truck, 
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartDrawer = () => {
  const router = useRouter();
  const [reservationTime, setReservationTime] = useState(587); // 9:47 in seconds
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const drawerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    crossSellProducts,
    addToCart 
  } = useCart();
  
  const FREE_SHIPPING_THRESHOLD = 5000; // Rs. 5,000 for free shipping

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log('CartDrawer - State:', { isCartOpen, cartItems, crossSellProducts });

  // Detect mobile screen size
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.originalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateFreeShippingProgress = () => {
    const subtotal = calculateSubtotal();
    return Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  };

  const getFreeShippingRemaining = () => {
    const subtotal = calculateSubtotal();
    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    return remaining > 0 ? remaining : 0;
  };

  // Timer countdown
  useEffect(() => {
    if (!isCartOpen || reservationTime <= 0) return;

    const timer = setInterval(() => {
      setReservationTime(prev => {
        if (prev <= 1) {
          // Timer expired - refresh cart or show warning
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCartOpen, reservationTime]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, closeCart]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsCheckoutLoading(false);
    router.push('/checkout');
  };

  const handleCrossSellAdd = (product) => {
    // Add cross-sell item to cart
    addToCart(product, 1);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = calculateSubtotal();
  const freeShippingProgress = calculateFreeShippingProgress();
  const freeShippingRemaining = getFreeShippingRemaining();

  if (!isClient || !isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-65 z-40 transition-opacity duration-300"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobile 
            ? 'bottom-0 left-0 right-0 w-full max-h-[85vh] rounded-t-2xl'
            : 'right-0 top-0 h-full w-full max-w-md'
        }`}
        style={{ 
          transform: isCartOpen 
            ? isMobile 
              ? 'translateY(0)' 
              : 'translateX(0)'
            : isMobile
              ? 'translateY(100%)'
              : 'translateX(100%)'
        }}
      >
        <div className={`flex flex-col ${isMobile ? 'h-[85vh]' : 'h-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h1 className="text-lg font-semibold text-gray-900">
              YOUR CART · {itemCount}
            </h1>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Reservation Timer Banner */}
            {reservationTime > 0 && (
              <div className="bg-green-50 border-b border-green-100 px-6 py-3">
                <p className="text-sm text-green-800 font-medium">
                  Your products are reserved for <span className="font-bold">{formatTime(reservationTime)} minutes</span>
                </p>
              </div>
            )}

            {/* Free Shipping Progress */}
            <div className="px-6 py-4 border-b border-gray-100">
              {freeShippingRemaining > 0 ? (
                <>
                  <p className="text-sm text-gray-700 mb-2">
                    You're <span className="font-semibold text-gray-900">Rs. {freeShippingRemaining.toFixed(2)}</span> away from free shipping
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full" />
                  </div>
                  <p className="text-sm text-green-600 font-medium">✓ Free shipping unlocked!</p>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || 'https://via.placeholder.com/80x80/1a365d/ffffff?text=Product'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">{item.variant}</p>
                        
                        {/* Price */}
                        <div className="flex items-center space-x-2 mb-2">
                          {item.originalPrice && item.originalPrice > item.price ? (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                Rs. {(item.originalPrice * item.quantity).toFixed(2)}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                Rs. {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 text-red-500 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cross-Sell Section */}
            {crossSellProducts.length > 0 && cartItems.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">People also bought</h3>
                <div className="space-y-3">
                  {crossSellProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <img
                        src={product.image || 'https://via.placeholder.com/60x60/1a365d/ffffff?text=Item'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                          Rs. {product.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCrossSellAdd(product)}
                        className="px-3 py-1 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Subtotal and CTA */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                Rs. {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Payment Trust Badges */}
            <div className="flex items-center justify-center space-x-4 py-2">
              <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isCheckoutLoading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                cartItems.length === 0 || isCheckoutLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
              }`}
            >
              {isCheckoutLoading ? (
                'Processing...'
              ) : (
                'Go to checkout'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
