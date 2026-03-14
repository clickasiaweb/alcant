import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

const SearchResults = () => {
  const router = useRouter();
  const { q, category, sort, price_min, price_max } = router.query;
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: category || '',
    sort: sort || 'relevance',
    priceMin: price_min || '',
    priceMax: price_max || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock search results
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Industrial Automation System',
      slug: 'premium-industrial-automation-system',
      price: 25000,
      originalPrice: 28000,
      rating: 4.8,
      reviews: 324,
      image: 'https://via.placeholder.com/300x300/1a365d/ffffff?text=Automation',
      category: 'Automation',
      isNew: true,
      discount: 10
    },
    {
      id: 2,
      name: 'Precision CNC Machine',
      slug: 'precision-cnc-machine',
      price: 180000,
      rating: 4.9,
      reviews: 128,
      image: 'https://via.placeholder.com/300x300/2c5282/ffffff?text=CNC',
      category: 'Machinery'
    },
    {
      id: 3,
      name: 'Quality Control System',
      slug: 'quality-control-system',
      price: 15000,
      rating: 4.7,
      reviews: 89,
      image: 'https://via.placeholder.com/300x300/2b6cb0/ffffff?text=QC',
      category: 'Quality Control'
    },
    {
      id: 4,
      name: 'Industrial Robot Arm',
      slug: 'industrial-robot-arm',
      price: 45000,
      rating: 4.8,
      reviews: 256,
      image: 'https://via.placeholder.com/300x300/3182ce/ffffff?text=Robot',
      category: 'Robotics'
    },
    {
      id: 5,
      name: 'Hydraulic Press System',
      slug: 'hydraulic-press-system',
      price: 35000,
      originalPrice: 40000,
      rating: 4.6,
      reviews: 67,
      image: 'https://via.placeholder.com/300x300/1a365d/ffffff?text=Press',
      category: 'Machinery',
      discount: 12
    },
    {
      id: 6,
      name: 'Conveyor Belt System',
      slug: 'conveyor-belt-system',
      price: 12000,
      rating: 4.5,
      reviews: 145,
      image: 'https://via.placeholder.com/300x300/2c5282/ffffff?text=Conveyor',
      category: 'Material Handling'
    }
  ];

  const categories = [
    'All Categories',
    'Automation',
    'Machinery',
    'Quality Control',
    'Robotics',
    'Material Handling'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter products based on search query and filters
      let filteredProducts = mockProducts;
      
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (filters.category && filters.category !== 'All Categories') {
        filteredProducts = filteredProducts.filter(product =>
          product.category === filters.category
        );
      }
      
      // Apply sorting
      switch (filters.sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.id - a.id);
          break;
        default:
          // relevance - keep original order
          break;
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    };

    performSearch();
  }, [searchQuery, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      sort: 'relevance',
      priceMin: '',
      priceMax: ''
    });
    setSearchQuery('');
    router.push('/search');
  };

  return (
    <Layout title={`Search Results${searchQuery ? ` for "${searchQuery}"` : ''}`}>
      <div className="bg-gray-50 py-8">
        <div className="container">
          {/* Search Header */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, or keywords..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `${products.length} products found`}
                </p>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
              <div className="bg-white rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category === 'All Categories' ? '' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Search Results */}
            <main className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;
