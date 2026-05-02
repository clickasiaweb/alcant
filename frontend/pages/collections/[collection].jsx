import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Star from 'lucide-react/dist/esm/icons/star';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Plus from 'lucide-react/dist/esm/icons/plus';
import { productsAPI, getProducts } from '../../services/api';
import { categoryService } from '../../services/categoryService';
import CategoryDebug from '../../components/CategoryDebug';

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

  // Collection mapping - using actual category IDs from database
  const getCollectionData = (collectionSlug) => {
    // Map collection slugs to actual category IDs from database
    const categoryMapping = {
      'phone-case': 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be', // Main category with phone products
      'iphone-cases': 'f009ca1d-9f5d-4bf3-81f7-b246d105d1be', // Same category
      'accessories': '883e60ba-b93d-4cb8-ab9e-680ac6bd6575',
      'car-interior': '10ed20c8-b707-471c-be22-fe4ed960e1cd',
      'yoga': '824e190f-b8f0-41e1-be24-da03ba52faa9',
      'travel-accessories': '73f3c2de-7ab8-4166-a351-671969411301'
    };
    
    const collections = {
      'phone-case': {
        title: 'Phone Cases Collection',
        description: 'Discover our complete collection of high-quality phone accessories designed to enhance your mobile experience',
        categoryId: categoryMapping['phone-case']
      },
      'iphone-cases': {
        title: 'iPhone Cases Collection', 
        description: 'Premium iPhone cases with advanced protection and style',
        categoryId: categoryMapping['iphone-cases'],
        subCategoryId: '3207f43f-b904-486e-b2e5-9c6230eb7793' // iPhone Cases subcategory
      },
      'iphone-17-pro': {
        title: 'iPhone 17 Pro Case Collection',
        description: 'Latest iPhone 17 Pro cases with cutting-edge protection',
        categoryId: categoryMapping['iphone-cases'],
        subCategoryId: '3207f43f-b904-486e-b2e5-9c6230eb7793',
        subSubCategoryId: 'iphone-17-pro-case-new' // Specific sub-subcategory
      },
      'accessories': {
        title: 'Accessories Collection',
        description: 'Discover our premium ΛʟcΛɴᴛ accessories for your devices',
        categoryId: categoryMapping['accessories']
      },
      'car-travel': {
        title: 'Car & Travel Collection',
        description: 'Premium ΛʟcΛɴᴛ car and travel accessories',
        categoryId: categoryMapping['car-travel']
      },
      'yoga': {
        title: 'Yoga Collection',
        description: 'Premium yoga accessories and equipment',
        categoryId: categoryMapping['yoga']
      },
      'travel': {
        title: 'Travel Accessories Collection',
        description: 'Essential travel accessories for your journeys',
        categoryId: categoryMapping['travel']
      },
      'sale': {
        title: 'Sale Collection',
        description: 'Special offers and discounted items',
        categoryId: null // Sale uses different endpoint
      }
    };
    
    // Return matching collection or create a dynamic one
    return collections[collectionSlug] || {
      title: `${collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1).replace('-', ' ')} Collection`,
      description: `Browse our premium ${collectionSlug.replace('-', ' ')} collection`,
      categoryId: categoryMapping[collectionSlug] || null
    };
  };

  const collectionData = getCollectionData(collection || 'phone-cases');

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
      
      console.log('🔍 Fetching products for collection:', collection);
      
      // Fetch products based on collection type using multiple approaches
      if (collection === 'sale') {
        console.log('🏷️ Fetching sale products');
        fetchedProducts = await productsAPI.getSale();
      } else {
        // Use the actual category ID from collection data
        const categoryId = collectionData?.categoryId;
        const subCategoryId = collectionData?.subCategoryId;
        const subSubCategoryId = collectionData?.subSubCategoryId;
        
        console.log('📂 Using filters:', { categoryId, subCategoryId, subSubCategoryId }, 'for collection:', collection);
        
        if (!categoryId) {
          console.log('❌ No category ID found for collection:', collection);
          fetchedProducts = await productsAPI.getAll(); // Fallback to all products
        } else {
          // Approach 1: Try getProducts with specific category filters
          try {
            const filters = { 
              categoryId: categoryId,
              limit: 50,
              isActive: true 
            };
            
            // Add subcategory filter if available
            if (subCategoryId) {
              filters.subCategoryId = subCategoryId;
            }
            
            // Add sub-subcategory filter if available
            if (subSubCategoryId) {
              filters.subSubCategoryId = subSubCategoryId;
            }
            
            console.log('🔄 Approach 1: getProducts with specific filters:', filters);
            fetchedProducts = await getProducts(filters);
            console.log('✅ Approach 1 result:', fetchedProducts);
          } catch (error1) {
            console.log('❌ Approach 1 failed:', error1);
            
            // Approach 2: Try getByCategory API
            try {
              console.log('🔄 Approach 2: getByCategory API');
              fetchedProducts = await productsAPI.getByCategory(collection);
              console.log('✅ Approach 2 result:', fetchedProducts);
            } catch (error2) {
              console.log('❌ Approach 2 failed:', error2);
              
              // Approach 3: Try with different category names
              const alternativeNames = [
                collection,
                collection.replace('-', ' '),
                collection.replace('-', ''),
                collection.charAt(0).toUpperCase() + collection.slice(1)
              ];
              
              for (const altName of alternativeNames) {
                try {
                  console.log('🔄 Approach 3: Trying alternative name:', altName);
                  fetchedProducts = await getProducts({ 
                    category: altName,
                    limit: 50,
                    isActive: true 
                  });
                  if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
                    console.log('✅ Approach 3 success with:', altName);
                    break;
                  }
                } catch (error3) {
                  console.log('❌ Approach 3 failed for', altName, ':', error3);
                }
              }
              
              // Approach 4: Fallback to all products
              if (!Array.isArray(fetchedProducts) || fetchedProducts.length === 0) {
                console.log('🔄 Approach 4: Fetching all products as fallback');
                fetchedProducts = await productsAPI.getAll();
              }
            }
          }
        }
      }
      
      // Ensure we have an array of products
      let productsArray = [];
      if (Array.isArray(fetchedProducts)) {
        productsArray = fetchedProducts;
      } else if (fetchedProducts?.products && Array.isArray(fetchedProducts.products)) {
        productsArray = fetchedProducts.products;
      } else if (fetchedProducts?.data && Array.isArray(fetchedProducts.data)) {
        productsArray = fetchedProducts.data;
      }
      
      console.log('📦 Final products array:', productsArray.length, 'items');
      console.log('📦 Sample product:', productsArray[0]);
      
      setProducts(productsArray);
      setCollectionInfo(collectionData);
    } catch (err) {
      console.error('❌ Error fetching collection products:', err);
      setError('Failed to load products');
      setProducts([]); // Set empty array on error
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
              <p className="text-gray-600">Loading products for "{collection}"...</p>
              <p className="text-xs text-gray-500 mt-2">Check browser console for API debugging</p>
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
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-100 rounded p-4 mb-4 text-left">
              <p className="text-sm font-mono mb-2">Debug Info:</p>
              <p className="text-xs text-gray-600">Collection: {collection}</p>
              <p className="text-xs text-gray-600">Products loaded: {products.length}</p>
              <p className="text-xs text-gray-600">Check browser console for API details</p>
            </div>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 mr-2"
            >
              Back to Home
            </button>
            <button 
              onClick={fetchCollectionProducts}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${collectionData.title} - ΛʟcΛɴᴛ`} description={collectionData.description}>
      <div className="min-h-screen bg-gray-50">

        {/* Debug Component - Remove in production */}
        <CategoryDebug collection={collection} />

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
