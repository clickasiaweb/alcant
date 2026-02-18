import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';

const SimpleTest = () => {
  const [logs, setLogs] = useState([]);
  const { 
    wishlistItems, 
    getWishlistCount, 
    isInWishlist, 
    toggleWishlist, 
    addToWishlist, 
    removeFromWishlist 
  } = useWishlist();

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testProduct = {
    id: 'simple-test-123',
    name: 'Simple Test Product',
    price: 99.99,
    image: 'test.jpg',
    category: 'Test',
    variant: 'Standard',
    slug: 'simple-test'
  };

  const handleTest = async () => {
    addLog('Starting test...');
    
    try {
      addLog(`Initial wishlist count: ${getWishlistCount()}`);
      addLog(`Is test product in wishlist: ${isInWishlist('simple-test-123')}`);
      
      addLog('Calling toggleWishlist...');
      const result = await toggleWishlist(testProduct);
      addLog(`Toggle result: ${result}`);
      
      addLog(`After toggle - wishlist count: ${getWishlistCount()}`);
      addLog(`After toggle - is in wishlist: ${isInWishlist('simple-test-123')}`);
      
      addLog('Current wishlist items:');
      wishlistItems.forEach((item, index) => {
        addLog(`  ${index + 1}. ${item.name} (${item.id})`);
      });
      
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
      console.error('Test error:', error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Simple Wishlist Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleTest}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Run Wishlist Test
        </button>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Current Status:</h3>
          <p>Wishlist Items: {wishlistItems.length}</p>
          <p>Count: {getWishlistCount()}</p>
          <p>Test Product in Wishlist: {isInWishlist('simple-test-123') ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
          <h3 className="font-semibold mb-2">Test Logs:</h3>
          {logs.length === 0 ? (
            <p className="text-gray-500">Click "Run Wishlist Test" to see logs</p>
          ) : (
            <pre className="text-xs whitespace-pre-wrap">{logs.join('\n')}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
