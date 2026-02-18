import React from 'react';
import DebugWishlist from '../components/DebugWishlist';
import WishlistButton from '../components/WishlistButton';
import { useWishlist } from '../contexts/WishlistContext';

const DebugPage = () => {
  const { getWishlistCount } = useWishlist();

  const testProduct = {
    id: 'debug-page-test',
    name: 'Debug Page Product',
    price: 49.99,
    image: 'https://picsum.photos/seed/debug-page/200/200.jpg',
    category: 'Test',
    variant: 'Standard',
    slug: 'debug-page-product'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Wishlist Debug Page</h1>
        
        <DebugWishlist />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">WishlistButton Test</h2>
          <div className="flex items-center space-x-4">
            <WishlistButton 
              product={testProduct}
              size="lg"
            />
            <div>
              <p className="font-medium">{testProduct.name}</p>
              <p className="text-gray-600">${testProduct.price}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Debug Steps:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Check browser console for any errors</li>
            <li>Click "Toggle Test Product" in DebugWishlist component</li>
            <li>Click the WishlistButton above</li>
            <li>Check if wishlist count updates</li>
            <li>Verify localStorage has wishlist data</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Common Issues:</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>Context not properly wrapped in _app.jsx</li>
            <li>localStorage not available (SSR issue)</li>
            <li>Product ID mismatch</li>
            <li>Service function errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
