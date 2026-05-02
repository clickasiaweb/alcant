import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Star from 'lucide-react/dist/esm/icons/star';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Plus from 'lucide-react/dist/esm/icons/plus';
import { productsAPI, getProducts } from '../../services/api';
import { categoryService } from '../../services/categoryService';

const CollectionPage = () => {
  const router = useRouter();
  const { collection } = router.query;

  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectionInfo, setCollectionInfo] = useState(null);
  
  // Filter states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Collection mapping
  const collectionMap = {
    'phone-cases': {
      title: 'Phone Cases Collection',
      description: 'Discover our complete collection of high-quality phone accessories designed to enhance your mobile experience',
      category: 'phone-cases'
    },
    'accessories': {
      title: 'Accessories Collection',
      description: 'Discover our premium ΛʟcΛɴᴛ accessories for your devices',
      category: 'accessories'
    },
    'wallets': {
      title: 'Wallets Collection',
      description: 'Premium ΛʟcΛɴᴛ wallets and card holders',
      category: 'wallets'
    },
    'office': {
      title: 'Office Collection',
      description: 'Premium ΛʟcΛɴᴛ office accessories',
      category: 'office'
    },
    'car-travel': {
      title: 'Car & Travel Collection',
      description: 'Premium ΛʟcΛɴᴛ car and travel accessories',
      category: 'car-travel'
    },
    'sale': {
      title: 'Sale Collection',
      description: 'Special offers and discounted items',
      category: 'sale'
    }
  };

  const collectionData = collectionMap[collection] || collectionMap['phone-cases'];

  // Fetch products data
  useEffect(() => {
    if (collection) {
      fetchCollectionProducts();
    }
  }, [collection]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [products, selectedColors, selectedPriceRanges]);

  const fetchCollectionProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let fetchedProducts = [];
      
      // Fetch products based on collection type
      if (collection === 'sale') {
        fetchedProducts = await productsAPI.getSale();
      } else if (collection === 'phone-cases') {
        fetchedProducts = await productsAPI.getByCategory('phone-cases');
      } else if (collection === 'accessories') {
        fetchedProducts = await productsAPI.getByCategory('accessories');
      } else if (collection === 'wallets') {
        fetchedProducts = await productsAPI.getByCategory('wallets');
      } else if (collection === 'office') {
        fetchedProducts = await productsAPI.getByCategory('office');
      } else if (collection === 'car-travel') {
        fetchedProducts = await productsAPI.getByCategory('car-travel');
      } else {
        // Fallback to all products
        fetchedProducts = await productsAPI.getAll();
      }
      
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      setCollectionInfo(collectionData);
    } catch (err) {
      console.error('Error fetching collection products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = Array.isArray(products) ? [...products] : [];
    
    // Apply color filters
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => {
        if (product.variants && product.variants.length > 0) {
          return product.variants.some(variant => 
            selectedColors.includes(variant.color?.toLowerCase())
          );
        }
        return selectedColors.includes(product.color?.toLowerCase());
      });
    }
    
    // Apply price range filters
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        return selectedPriceRanges.some(range => {
          if (range === 'under-25') return price < 2500;
          if (range === '25-50') return price >= 2500 && price <= 5000;
          if (range === '50-100') return price > 5000 && price <= 10000;
          return false;
        });
      });
    }
    
    setFilteredProducts(filtered);
  };

  const toggleColorFilter = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedPriceRanges([]);
  };

  // Get unique colors from products
  const getAvailableColors = () => {
    const colors = new Set();
    if (Array.isArray(products)) {
      products.forEach(product => {
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach(variant => {
            if (variant.color) colors.add(variant.color.toLowerCase());
          });
        } else if (product.color) {
          colors.add(product.color.toLowerCase());
        }
      });
    }
    return Array.from(colors);
  };

  // Get product counts for price ranges
  const getPriceRangeCounts = () => {
    const counts = {
      'under-25': 0,
      '25-50': 0,
      '50-100': 0
    };
    
    if (Array.isArray(products)) {
      products.forEach(product => {
        const price = product.price || 0;
        if (price < 2500) counts['under-25']++;
        else if (price >= 2500 && price <= 5000) counts['25-50']++;
        else if (price > 5000 && price <= 10000) counts['50-100']++;
      });
    }
    
    return counts;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderProductBadge = (product) => {
    if (product.isNew) {
      return <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>;
    }
    if (product.isBestseller) {
      return <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">Bestseller</span>;
    }
    if (product.oldPrice && product.oldPrice > product.price) {
      const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      return <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">{discount}% Off</span>;
    }
    if (product.isLimitedEdition) {
      return <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">Limited Edition</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${collectionData.title} - ΛʟcΛɴᴛ`} description={collectionData.description}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-primary-900">ALCANT</Link>
                <nav className="hidden md:flex space-x-6">
                  <Link href="/collections/accessories" className="text-gray-700 hover:text-primary-600">Accessories</Link>
                  <Link href="/collections/car-travel" className="text-gray-700 hover:text-primary-600">Car & Travel</Link>
                  <Link href="/collections/phone-cases" className="text-gray-700 hover:text-primary-600">Phone Cases</Link>
                  <Link href="/collections/wallets" className="text-gray-700 hover:text-primary-600">Wallets & Cards</Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Header */}
        <div className="bg-white py-12">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {collectionData.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {collectionData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  {(selectedColors.length > 0 || selectedPriceRanges.length > 0) && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Color Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                  <div className="space-y-2">
                    {getAvailableColors().slice(0, 6).map((color) => (
                      <label key={color} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => toggleColorFilter(color)}
                          className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-2 border border-gray-300"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-sm text-gray-700 capitalize">{color}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'under-25', label: 'Under $25', max: 2500 },
                      { id: '25-50', label: '$25 - $50', min: 2500, max: 5000 },
                      { id: '50-100', label: '$50 - $100', min: 5000, max: 10000 }
                    ].map((range) => {
                      const counts = getPriceRangeCounts();
                      return (
                        <label key={range.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range.id)}
                            onChange={() => togglePriceRange(range.id)}
                            className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">
                            {range.label} ({counts[range.id]})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Products Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} {collection === 'phone-cases' ? 'phone accessories' : 'products'}
                </p>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Case</span>
                          </div>
                        )}
                        
                        {/* Product Badge */}
                        {renderProductBadge(product)}
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-2">
                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                              <ShoppingCart className="w-4 h-4 text-gray-700" />
                            </button>
                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                          {product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{product.oldPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-lg p-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or browse our other collections.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionPage;
