import React, { useState } from 'react';

const SimpleTest = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test</h1>
      <p className="mb-4">Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Increment
      </button>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Cart Context Test</h2>
        <button 
          onClick={() => {
            try {
              const { useCart } = require('../contexts/CartContext');
              const cart = useCart();
              console.log('Cart context works:', cart);
              alert('Cart context loaded successfully!');
            } catch (error) {
              console.error('Cart context error:', error);
              alert('Cart context error: ' + error.message);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Test Cart Context
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;
