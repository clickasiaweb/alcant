import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartIcon = ({ className = '' }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  try {
    const { cartItems, openCart, calculateTotalItems } = useCart();
    const totalItems = calculateTotalItems();

    console.log('CartIcon - cartItems:', cartItems, 'totalItems:', totalItems);

    if (!isClient) {
      // Return a placeholder during SSR to prevent hydration mismatch
      return (
        <button className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}>
          <ShoppingBag className="w-6 h-6 text-gray-700" />
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          console.log('Cart icon clicked');
          openCart();
        }}
        className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
        aria-label="Shopping cart"
      >
        <ShoppingBag className="w-6 h-6 text-gray-700" />
        
        {/* Item count badge */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>
    );
  } catch (error) {
    console.error('CartIcon error:', error);
    return (
      <button className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}>
        <ShoppingBag className="w-6 h-6 text-gray-700" />
      </button>
    );
  }
};

export default CartIcon;
