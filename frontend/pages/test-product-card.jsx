import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const TestProductCard = () => {
  const { getWishlistCount } = useWishlist();
  const { calculateTotalItems } = useCart();
  
  // Sample products for testing
  const testProducts = [
    {
      id: 'pc1',
      name: 'iPhone 15 Pro Case - Red',
      price: 89.99,
      originalPrice: 99.99,
      image: 'https://picsum.photos/seed/iphone-case-red/300/300.jpg',
      category: 'Phone Cases',
      variant: 'iPhone 15 Pro / Red',
      slug: 'iphone-15-pro-case-red',
      brand: 'Premium Cases',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      colors: ['#FF0000', '#000000', '#FFFFFF', '#0000FF']
    },
    {
      id: 'pc2',
      name: 'Leather Wallet - Brown',
      price: 59.99,
      image: 'https://picsum.photos/seed/leather-wallet/300/300.jpg',
      category: 'Wallets',
      variant: 'Standard / Brown',
      slug: 'leather-wallet-brown',
      brand: 'Luxury Goods',
      rating: 4.8,
      reviews: 89,
      discount: 20,
      colors: ['#8B4513', '#000000', '#2F4F4F']
    },
    {
      id: 'pc3',
      name: 'Wireless Headphones',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://picsum.photos/seed/wireless-headphones/300/300.jpg',
      category: 'Accessories',
      variant: 'Bluetooth / Black',
      slug: 'wireless-headphones',
      brand: 'AudioTech',
      rating: 4.7,
      reviews: 234,
      colors: ['#000000', '#FFFFFF', '#FF1493', '#00CED1']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Card Wishlist Test</h1>
        
        {/* Status Display */}
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

        {/* Product Cards Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Product Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Hover over product cards to see overlay actions</li>
            <li>Click the heart icon in the top-right corner (always visible)</li>
            <li>Click the heart icon in the bottom overlay (appears on hover)</li>
            <li>Click "Quick Add" to test cart functionality</li>
            <li>Check the status display above to see counts update</li>
            <li>Test the "NEW" badge and discount functionality</li>
            <li>Verify color swatches display correctly</li>
          </ul>
        </div>

        {/* Features Demonstrated */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-green-900 mb-2">Features Demonstrated:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800">
            <div>
              <h4 className="font-medium mb-2">Wishlist Functionality:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>✅ Functional wishlist buttons</li>
                <li>✅ Persistent wishlist state</li>
                <li>✅ Visual feedback (filled/unfilled)</li>
                <li>✅ Multiple touchpoints per card</li>
                <li>✅ Dynamic badge count updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Product Card Features:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>✅ Hover overlay with actions</li>
                <li>✅ Quick add to cart functionality</li>
                <li>✅ NEW and discount badges</li>
                <li>✅ Star ratings display</li>
                <li>✅ Color swatches</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProductCard;
