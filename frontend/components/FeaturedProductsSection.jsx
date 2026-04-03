// Featured Products Section - v4.0 - Bulletproof
import React, { useState, useEffect } from "react";

const FeaturedProductsSection = () => {
  const [mounted, setMounted] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured?limit=10&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Simple data extraction - handle any response format
      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
      } else if (data && Array.isArray(data.data)) {
        products = data.data;
      }
      
      console.log('� Featured products loaded:', products.length);
      setFeaturedProducts(products);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      setError(error.message);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    console.log('🔄 Refreshing featured products');
    fetchFeaturedProducts();
  };

  // Loading state
  if (!mounted || loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            Featured Products
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            Featured Products
          </h2>
          <div className="text-center text-gray-600">
            <p>{error}</p>
            <button 
              onClick={fetchFeaturedProducts}
              className="mt-4 px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12 text-center">
            Featured Products
          </h2>
          <div className="text-center text-gray-600">
            <p>No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // Success state - minimal safe rendering
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900">
            Featured Products
          </h2>
          <button
            onClick={refreshProducts}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Refresh featured products"
          >
            ↻
          </button>
        </div>

        <div className="relative">
          <div 
            id="featured-products-container"
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {featuredProducts && featuredProducts.map((product, index) => {
              // Only render if product has essential data
              if (!product || !product.id) return null;
              
              return (
                <div 
                  key={product.id} 
                  className="flex-none w-72 md:w-80"
                  style={{ minWidth: '288px' }}
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={product.image || 'https://picsum.photos/seed/product/400/400.jpg'} 
                          alt={product.name || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://picsum.photos/seed/fallback/400/400.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {product.name || 'Unknown Product'}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-primary-900">
                            ${product.price || 0}
                          </span>
                          {product.old_price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.old_price}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating || 0} ({product.reviews || 0})
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.location.href = `/product-details/${product.slug || '#'}`}
                            className="flex-1 px-4 py-2 bg-primary-900 text-white text-sm rounded-lg hover:bg-primary-800 transition-colors"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => console.log('Add to cart:', product.name)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            🛒
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Gradient fade effects */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
