import React, { useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import WishlistButton from '../components/WishlistButton';
import QuickAddToCart from '../components/QuickAddToCart';

const TestSearchAndWishlist = () => {
  const { openSearch } = useSearch();
  const { wishlistItems, getWishlistCount } = useWishlist();
  const { cartItems, calculateTotalItems } = useCart();
  
  // Sample products for testing
  const testProducts = [
    {
      id: 1,
      name: 'Premium Phone Case',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://picsum.photos/seed/phone-case-1/200/200.jpg',
      category: 'Phone Cases',
      variant: 'iPhone 15 Pro / Black',
      slug: 'premium-phone-case'
    },
    {
      id: 2,
      name: 'Leather Wallet',
      price: 59.99,
      image: 'https://picsum.photos/seed/wallet-1/200/200.jpg',
      category: 'Wallets',
      variant: 'Standard / Brown',
      slug: 'leather-wallet'
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://picsum.photos/seed/headphones-1/200/200.jpg',
      category: 'Accessories',
      variant: 'Bluetooth / Black',
      slug: 'wireless-headphones'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search & Wishlist Test Page</h1>
        
        {/* Search Test Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Functionality Test</h2>
          <p className="text-gray-600 mb-4">Click the button below to test the search dropdown:</p>
          <button
            onClick={openSearch}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Open Search
          </button>
        </div>

        {/* Wishlist Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">{getWishlistCount()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cart Items</p>
              <p className="text-2xl font-bold text-gray-900">{calculateTotalItems()}</p>
            </div>
          </div>
        </div>

        {/* Test Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.variant}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <WishlistButton 
                    product={product}
                    size="md"
                    className="w-full"
                  />
                  <QuickAddToCart 
                    product={product}
                    size="md"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Wishlist Items */}
        {wishlistItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Wishlist Items</h2>
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.variant}</p>
                    <p className="font-semibold text-gray-900">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Click "Open Search" to test the search dropdown functionality</li>
            <li>Try searching for "phone", "wallet", or "headphones"</li>
            <li>Click wishlist buttons on products to add/remove items</li>
            <li>Click "Add to Cart" buttons to test cart functionality</li>
            <li>Check the header icons to see badge counts update</li>
            <li>Test keyboard navigation (ESC to close modals)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestSearchAndWishlist;
