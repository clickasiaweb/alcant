import React, { useState } from 'react';

const BasicTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'Test Product',
      price: 100
    };
    setItems(prev => [...prev, newItem]);
    setIsOpen(true);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Basic Cart Test</h1>
      
      <button 
        onClick={addItem}
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Add Item to Cart
      </button>

      <div style={{ marginBottom: '20px' }}>
        <strong>Cart Items: {items.length}</strong>
        {items.map(item => (
          <div key={item.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            {item.name} - ${item.price}
            <button 
              onClick={() => removeItem(item.id)}
              style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Simple Cart Drawer */}
      {isOpen && (
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
          <div style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Cart ({items.length} items)</h2>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {items.map(item => (
              <div key={item.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
                {item.name} - ${item.price}
              </div>
            ))}
            {items.length === 0 && <p>Cart is empty</p>}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Instructions:</h3>
        <ol>
          <li>Click "Add Item to Cart" button</li>
          <li>Cart drawer should open from the right</li>
          <li>Click × or overlay to close</li>
          <li>Check browser console for any errors</li>
        </ol>
      </div>
    </div>
  );
};

export default BasicTest;
