import React from 'react';
import CartDrawer from '../components/CartDrawer';
import CartIcon from '../components/CartIcon';
import ProductCard from '../components/ProductCard';
import Layout from '../components/Layout';

const CartDemo = () => {
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
    },
    {
      id: 2,
      name: 'Quality Control System',
      slug: 'quality-control-system',
      price: 15000,
      image: 'https://via.placeholder.com/300x300/2b6cb0/ffffff?text=QC',
      category: 'Quality Control',
      brand: 'QualityTech',
      rating: 4.8,
      reviews: 89,
      variant: 'Professional Model',
      inStock: true
    },
    {
      id: 3,
      name: 'Industrial Robot Arm',
      slug: 'industrial-robot-arm',
      price: 45000,
      originalPrice: 50000,
      image: 'https://via.placeholder.com/300x300/3182ce/ffffff?text=Robot',
      category: 'Robotics',
      brand: 'RoboTech',
      rating: 4.7,
      reviews: 156,
      discount: 10,
      variant: 'Standard Model',
      inStock: true
    }
  ];

  return (
    <Layout title="Cart Demo - Slide-in Checkout">
      <div className="min-h-screen bg-gray-50">
          {/* Demo Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Cart Drawer Demo</h1>
                  <p className="text-gray-600 mt-1">Test the slide-in checkout experience</p>
                </div>
                <CartIcon />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800">How to test:</h3>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Click "Quick Add" on any product to add it to cart and open drawer</li>
                    <li>• Click the cart icon in the header to open/close the drawer</li>
                    <li>• Test quantity updates, item removal, and cross-sell functionality</li>
                    <li>• Try the responsive design by resizing your browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Click "Quick Add" to test the cart functionality</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                />
              ))}
            </div>
          </div>

          {/* Cart Drawer */}
          <CartDrawer />
        </div>
      </Layout>
  );
};

export default CartDemo;
