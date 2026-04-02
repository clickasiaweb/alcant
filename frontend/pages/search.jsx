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
  const [categories, setCategories] = useState(['All Categories']);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: category || '',
    sort: sort || 'relevance',
    priceMin: price_min || '',
    priceMax: price_max || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'production' 
          ? 'https://alcant-backend.vercel.app/api' 
          : 'http://localhost:5001/api';
        
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const categoryList = Object.keys(data.categories || {});
        setCategories(['All Categories', ...categoryList]);
        
      } catch (error) {
        console.error('Categories fetch error:', error);
        // Fallback to basic categories
        setCategories(['All Categories', 'Phone Cases', 'Accessories', 'Wallets']);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
      
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'production' 
          ? 'https://alcant-backend.vercel.app/api' 
          : 'http://localhost:5001/api';
        
        // Build search URL with parameters
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (filters.category && filters.category !== 'All Categories') params.set('category', filters.category);
        if (filters.priceMin) params.set('min_price', filters.priceMin);
        if (filters.priceMax) params.set('max_price', filters.priceMax);
        params.set('page', '1');
        params.set('limit', '24');
        
        // Map sort options to backend sort parameters
        const sortMap = {
          'relevance': '',
          'price-low': 'price_asc',
          'price-high': 'price_desc',
          'rating': 'rating',
          'newest': 'newest'
        };
        
        if (filters.sort !== 'relevance' && sortMap[filters.sort]) {
          params.set('sort', sortMap[filters.sort]);
        }
        
        const url = `${API_BASE_URL}/products/search?${params.toString()}`;
        console.log('🔍 Search URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform products to match expected format
        const transformedProducts = (data.products || []).map(product => ({
          id: product.id || product._id,
          name: product.name,
          slug: product.slug,
          price: product.price || product.final_price || 0,
          originalPrice: product.old_price || product.original_price,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          image: product.image || product.images?.[0] || 'https://picsum.photos/seed/product/300x300.jpg',
          category: product.category || 'Unknown',
          isNew: product.is_new || false,
          discount: product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0,
          description: product.description
        }));
        
        setProducts(transformedProducts);
        
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
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
