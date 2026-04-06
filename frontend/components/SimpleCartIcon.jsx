import React from 'react';
import { useCart } from '../contexts/CartContext';

const SimpleCartIcon = () => {
  const { cartItems, openCart, calculateTotalItems } = useCart();
  
  // Safely calculate total items with fallback
  const totalItems = cartItems ? calculateTotalItems() : 0;

  console.log('SimpleCartIcon - cartItems:', cartItems, 'totalItems:', totalItems);

  return (
    <button 
      onClick={() => {
        console.log('SimpleCartIcon - Cart icon clicked');
        openCart();
      }}
      style={{
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      🛒 Cart ({totalItems})
    </button>
  );
};

export default SimpleCartIcon;
