import React from 'react';
import { useSupabaseCart } from '../contexts/SupabaseCartContext';

const SimpleCartIcon = () => {
  const { cartItems, openCart, calculateTotalItems } = useSupabaseCart();
  
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
