import React from 'react';
import CartDrawer from '../components/CartDrawer';
import CartIcon from '../components/CartIcon';
import ProductCard from '../components/ProductCard';
import ErrorBoundary from '../components/ErrorBoundary';

const TestCart = () => {
  // Mock products for demo
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Industrial Automation System',
      slug: 'premium-industrial-automation-system',
      price: 25000,
      originalPrice: 28000,
      image: 'https://via.placeholder.com/300x300/1a365d/ffffff?text=Automation',
      category: 'Automation',
      brand: 'TechCorp',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      discount: 11,
      variant: 'Standard Model',
      inStock: true
    }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Simple Header */}
        <div className="bg-white shadow-sm border-b mb-8">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Cart Test Page</h1>
              <ErrorBoundary>
                <CartIcon />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Test Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-blue-800 mb-2">Test Instructions:</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click "Quick Add" button to add product to cart</li>
              <li>• Click cart icon to open/close drawer</li>
              <li>• Check browser console for debug messages</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product, index) => (
              <ErrorBoundary key={product.id}>
                <ProductCard 
                  product={product} 
                  index={index} 
                />
              </ErrorBoundary>
            ))}
          </div>
        </div>

        {/* Cart Drawer */}
        <ErrorBoundary>
          <CartDrawer />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default TestCart;
