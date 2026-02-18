import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, X, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const WishlistDropdown = () => {
  const {
    wishlistItems,
    isWishlistOpen,
    isClient,
    closeWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist
  } = useWishlist();

  const { addToCart } = useCart();
  const [isMovingToCart, setIsMovingToCart] = useState(null);

  if (!isClient || !isWishlistOpen) return null;

  const handleMoveToCart = async (productId) => {
    setIsMovingToCart(productId);
    const success = moveToCart(productId, addToCart);
    
    if (success) {
      // Item moved successfully
      setTimeout(() => {
        setIsMovingToCart(null);
      }, 500);
    } else {
      setIsMovingToCart(null);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  const calculateTotal = () => {
    return wishlistItems.reduce((total, item) => {
      const itemPrice = item.originalPrice || item.price;
      return total + itemPrice;
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 animate-in fade-in duration-200"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Wishlist Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h1 className="text-lg font-semibold text-gray-900">
                WISHLIST · {wishlistItems.length}
              </h1>
            </div>
            <button 
              onClick={closeWishlist}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Wishlist Items */}
          <div className="px-6 py-4">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Save items you love for later
                </p>
                <button 
                  onClick={closeWishlist}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Product Thumbnail */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || 'https://via.placeholder.com/64x64/1a365d/ffffff?text=Product'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                      
                      {/* Price */}
                      <div className="mt-2">
                        {item.originalPrice && item.originalPrice > item.price ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400 line-through">
                              Rs. {item.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              Rs. {item.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-gray-900">
                            Rs. {item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 mt-3">
                        <button 
                          onClick={() => handleMoveToCart(item.id)}
                          disabled={isMovingToCart === item.id}
                          className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded transition-colors ${
                            isMovingToCart === item.id
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          {isMovingToCart === item.id ? (
                            <>
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                              <span>Moving...</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove from wishlist"
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
          
        </div>
        
        {/* Fixed Bottom Section */}
        {wishlistItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 space-y-4">
            
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                Rs. {calculateTotal().toFixed(2)}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href="/wishlist">
                <a 
                  onClick={closeWishlist}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                >
                  View Full Wishlist
                </a>
              </Link>
              
              <button 
                onClick={handleClearAll}
                className="w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Clear Wishlist
              </button>
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
};

export default WishlistDropdown;
