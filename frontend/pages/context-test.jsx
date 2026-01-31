import React from 'react';
import { useCart } from '../contexts/CartContext';

const ContextTest = () => {
  let cartContext;
  
  try {
    cartContext = useCart();
    console.log('ContextTest - Cart context loaded successfully:', cartContext);
  } catch (error) {
    console.error('ContextTest - Error loading cart context:', error);
    return (
      <div style={{ padding: '20px' }}>
        <h1>Context Test - Error</h1>
        <p style={{ color: 'red' }}>Error: {error.message}</p>
        <p>The CartContext is not available. Check if CartProvider is wrapping this component.</p>
      </div>
    );
  }

  const { cartItems, isCartOpen, addToCart, openCart, closeCart } = cartContext;

  const testProduct = {
    id: 1,
    name: 'Test Product',
    price: 100,
    category: 'Test'
  };

  const handleAddToCart = () => {
    console.log('ContextTest - Adding to cart:', testProduct);
    try {
      addToCart(testProduct, 1);
      console.log('ContextTest - addToCart called successfully');
    } catch (error) {
      console.error('ContextTest - Error in addToCart:', error);
    }
  };

  const handleOpenCart = () => {
    console.log('ContextTest - Opening cart');
    try {
      openCart();
      console.log('ContextTest - openCart called successfully');
    } catch (error) {
      console.error('ContextTest - Error in openCart:', error);
    }
  };

  const handleCloseCart = () => {
    console.log('ContextTest - Closing cart');
    try {
      closeCart();
      console.log('ContextTest - closeCart called successfully');
    } catch (error) {
      console.error('ContextTest - Error in closeCart:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Cart Context Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Context State:</h3>
        <p>Cart Items: {cartItems.length}</p>
        <p>Is Cart Open: {isCartOpen ? 'YES' : 'NO'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleAddToCart}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Add to Cart
        </button>

        <button 
          onClick={handleOpenCart}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Open Cart
        </button>

        <button 
          onClick={handleCloseCart}
          style={{
            backgroundColor: '#6c757d',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close Cart
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Cart Items:</h3>
        {cartItems.map(item => (
          <div key={item.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            {item.name} - ${item.price} × {item.quantity}
          </div>
        ))}
        {cartItems.length === 0 && <p>Cart is empty</p>}
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Instructions:</h3>
        <ol>
          <li>Open browser console (F12)</li>
          <li>Click "Add to Cart" - check console for messages</li>
          <li>Click "Open Cart" - check if isCartOpen changes to YES</li>
          <li>Click "Close Cart" - check if isCartOpen changes to NO</li>
          <li>Look for any error messages in console</li>
        </ol>
        <p><strong>Expected console messages:</strong></p>
        <ul>
          <li>ContextTest - Cart context loaded successfully</li>
          <li>ContextTest - Adding to cart: product object</li>
          <li>CartContext - addToCart called with: product object</li>
          <li>ContextTest - addToCart called successfully</li>
        </ul>
      </div>
    </div>
  );
};

export default ContextTest;
