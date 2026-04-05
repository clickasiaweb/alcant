import React, { useState, useEffect } from 'react';
import EnhancedProductCard from './EnhancedProductCard';
import ViewAllProductsButton from './ViewAllProductsButton';
import { Grid, Filter } from 'lucide-react';

const ProductGridSection = ({ 
  title = "Products", 
  products = [], 
  loading = false,
  showViewAll = true,
  viewAllHref = "/products",
  columns = 4,
  showFilters = false 
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    priceRanges: [],
    brands: []
  });

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const getGridClasses = () => {
    const baseClasses = "grid gap-6";
    const columnClasses = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    };
    return `${baseClasses} ${columnClasses[columns] || columnClasses[4]}`;
  };

  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-200 h-64"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <Grid className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600">Loading amazing products...</p>
          </div>
          <div className={getGridClasses()}>
            {[...Array(columns * 2)].map((_, i) => (
              <div key={i}>{renderSkeleton()}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or browse our other collections.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <Grid className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed to enhance your lifestyle
          </p>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Color Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Blue', 'Brown', 'Black', 'Red', 'Green'].map((color) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            // Handle filter logic here
                          }}
                        />
                        <span className="text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Under $25', count: 4 },
                      { label: '$25 - $50', count: 6 },
                      { label: '$50 - $100', count: 5 },
                      { label: '$100 - $200', count: 1 },
                      { label: 'Over $200', count: 13 }
                    ].map((range) => (
                      <label key={range.label} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={(e) => {
                              // Handle filter logic here
                            }}
                          />
                          <span className="text-sm text-gray-700">{range.label}</span>
                        </div>
                        <span className="text-xs text-gray-500">({range.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Brand</h4>
                  <div className="space-y-2">
                    {['ΛʟcΛɴᴛ', 'Premium', 'Luxury'].map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={(e) => {
                            // Handle filter logic here
                          }}
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={getGridClasses()}>
          {filteredProducts.map((product, index) => (
            <EnhancedProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-12">
            <ViewAllProductsButton href={viewAllHref} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGridSection;
