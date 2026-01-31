import React from 'react';
import { useCart } from '../contexts/CartContext';

const SimpleCartIcon = () => {
  try {
    const { cartItems, openCart, calculateTotalItems } = useCart();
    const totalItems = calculateTotalItems();

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
  } catch (error) {
    console.error('SimpleCartIcon error:', error);
    return (
      <button style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        🛒 Cart
      </button>
    );
  }
};

export default SimpleCartIcon;
