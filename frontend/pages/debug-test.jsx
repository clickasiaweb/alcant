import React from 'react';
import SimpleProductCard from '../components/SimpleProductCard';
import SimpleCartIcon from '../components/SimpleCartIcon';

const DebugTest = () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100,
    category: 'Test'
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Debug Test Page</h1>
        <SimpleCartIcon />
      </div>
      
      <p>This page tests the cart functionality with minimal styling.</p>
      
      <SimpleProductCard product={mockProduct} />
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h2>Debug Instructions:</h2>
        <ol>
          <li>Open browser console (F12)</li>
          <li>Click "Add to Cart" button</li>
          <li>Click cart icon to test drawer</li>
          <li>Check console for debug messages</li>
          <li>Look for any error messages</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugTest;
