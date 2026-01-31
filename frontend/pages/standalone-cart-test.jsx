import React, { createContext, useContext, useState } from 'react';

// Standalone cart context for testing
const StandaloneCartContext = createContext();

const StandaloneCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1) => {
    console.log('Standalone - Adding to cart:', product);
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const openCart = () => {
    console.log('Standalone - Opening cart');
    setIsCartOpen(true);
  };

  const closeCart = () => {
    console.log('Standalone - Closing cart');
    setIsCartOpen(false);
  };

  return (
    <StandaloneCartContext.Provider value={{
      cartItems,
      isCartOpen,
      addToCart,
      openCart,
      closeCart
    }}>
      {children}
    </StandaloneCartContext.Provider>
  );
};

const useStandaloneCart = () => {
  const context = useContext(StandaloneCartContext);
  if (!context) {
    throw new Error('useStandaloneCart must be used within a StandaloneCartProvider');
  }
  return context;
};

const TestProduct = () => {
  const { addToCart } = useStandaloneCart();
  
  const product = {
    id: 1,
    name: 'Test Product',
    price: 100
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button 
        onClick={() => addToCart(product, 1)}
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

const TestCartIcon = () => {
  const { cartItems, openCart } = useStandaloneCart();
  
  return (
    <button 
      onClick={openCart}
      style={{
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Cart ({cartItems.length})
    </button>
  );
};

const TestCartDrawer = () => {
  const { cartItems, isCartOpen, closeCart } = useStandaloneCart();
  
  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <h2>Cart ({cartItems.length} items)</h2>
        <button onClick={closeCart} style={{ float: 'right' }}>×</button>
      </div>
      <div style={{ padding: '20px' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <p>{item.name} - ${item.price} × {item.quantity}</p>
          </div>
        ))}
        {cartItems.length === 0 && <p>Cart is empty</p>}
      </div>
    </div>
  );
};

const StandaloneCartTest = () => {
  return (
    <StandaloneCartProvider>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1>Standalone Cart Test</h1>
          <TestCartIcon />
        </div>
        
        <p>This tests the cart functionality with a completely standalone implementation.</p>
        
        <TestProduct />
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h2>Test Instructions:</h2>
          <ol>
            <li>Click "Add to Cart" button</li>
            <li>Click cart icon to open drawer</li>
            <li>Check console for debug messages</li>
          </ol>
        </div>
        
        <TestCartDrawer />
      </div>
    </StandaloneCartProvider>
  );
};

export default StandaloneCartTest;
