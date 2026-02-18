import React, { useEffect } from 'react';
import { useWishlist } from '../contexts/WishlistContext';

const DebugWishlist = () => {
  const { 
    wishlistItems, 
    getWishlistCount, 
    isInWishlist, 
    toggleWishlist, 
    openWishlist 
  } = useWishlist();

  const testProduct = {
    id: 'debug-test',
    name: 'Debug Product',
    price: 99.99,
    image: 'https://picsum.photos/seed/debug/100/100.jpg',
    category: 'Test',
    variant: 'Test',
    slug: 'debug-product'
  };

  useEffect(() => {
    console.log('DebugWishlist - Context loaded');
    console.log('DebugWishlist - Wishlist items:', wishlistItems);
    console.log('DebugWishlist - Count:', getWishlistCount());
  }, [wishlistItems, getWishlistCount]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Wishlist Debug</h2>
      
      <div className="space-y-4">
        <div>
          <p><strong>Wishlist Items:</strong> {wishlistItems.length}</p>
          <p><strong>Count:</strong> {getWishlistCount()}</p>
          <p><strong>Is Test Product in Wishlist:</strong> {isInWishlist('debug-test') ? 'Yes' : 'No'}</p>
        </div>

        <button
          onClick={() => {
            console.log('Debug: Toggling wishlist');
            toggleWishlist(testProduct);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Toggle Test Product
        </button>

        <button
          onClick={openWishlist}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          Open Wishlist
        </button>

        <div className="mt-4">
          <h3 className="font-semibold">Current Wishlist Items:</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(wishlistItems, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugWishlist;
