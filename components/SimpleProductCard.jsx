import React from 'react';
import { useCart } from '../contexts/CartContext';

const SimpleProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log('SimpleProductCard - Adding to cart:', product);
    try {
      addToCart(product, 1);
      console.log('SimpleProductCard - addToCart called successfully');
    } catch (error) {
      console.error('SimpleProductCard - Error:', error);
      alert('Error adding to cart: ' + error.message);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '8px' }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button 
        onClick={handleAddToCart}
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default SimpleProductCard;
