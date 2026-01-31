import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Star from 'lucide-react/dist/esm/icons/star';
import Filter from 'lucide-react/dist/esm/icons/filter';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { productsAPI } from '../../services/api';

const CategoryPage = () => {
  const router = useRouter();
  const { category, subcategory, sort } = router.query;
  
  const [sortBy, setSortBy] = useState(sort || 'featured');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category metadata
  const categoryMetadata = {
    'phone-cases': {
      title: 'Phone Cases',
      description: 'Premium Alcantara cases for your smartphones'
    },
    'wallets-cards': {
      title: 'Wallets & Cards',
      description: 'Premium Alcantara wallets and card holders'
    },
    'accessories': {
      title: 'Accessories',
      description: 'Premium Alcantara accessories for your devices'
    },
    'car-travel': {
      title: 'Car & Travel',
      description: 'Premium Alcantara car and travel accessories'
    },
    'sale': {
      title: 'Sale',
      description: 'Special offers and discounted items'
    }
  };

  // Mock subcategories for testing
  const getMockSubcategories = (categorySlug) => {
    const mockData = {
      'dfgf': [
        { name: 'Phone', slug: 'phone' },
        { name: 'General', slug: 'general' },
        { name: 'Test Subcategory', slug: 'test-subcategory' }
      ],
      'test-admin-panel': [
        { name: 'Phone', slug: 'phone' },
        { name: 'General', slug: 'general' },
        { name: 'Test Subcategory', slug: 'test-subcategory' }
      ],
      'test-category': [
        { name: 'General', slug: 'general' },
        { name: 'Test Subcategory', slug: 'test-subcategory' }
      ],
      'phone-cases': [
        { name: 'iPhone Cases', slug: 'iphone-cases' },
        { name: 'Samsung Cases', slug: 'samsung-cases' },
        { name: 'Google Pixel Cases', slug: 'google-pixel-cases' }
      ],
      'wallets-cards': [
        { name: 'Card Holders', slug: 'card-holders' },
        { name: 'Full Wallets', slug: 'full-wallets' },
        { name: 'Mini Wallets', slug: 'mini-wallets' }
      ],
      'accessories': [
        { name: 'Watch Bands', slug: 'watch-bands' },
        { name: 'Keychains', slug: 'keychains' },
        { name: 'Tech Accessories', slug: 'tech-accessories' }
      ],
      'car-travel': [
        { name: 'Car Accessories', slug: 'car-accessories' },
        { name: 'Travel Essentials', slug: 'travel-essentials' },
        { name: 'Luxury Travel', slug: 'luxury-travel' }
      ]
    };
    return mockData[categorySlug] || [];
  };

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      if (!category) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load products for the category with subcategory filter if present
        const options = {};
        if (subcategory) options.subcategory = subcategory;
        if (sort) options.sort = sort;
        
        const productsData = await productsAPI.getByCategory(category, options);
        setProducts(productsData.products || []);
        
        // Load all categories for navigation
        const categoriesData = await productsAPI.getCategories();
        setCategories(categoriesData.categories || {});
        
        // Load subcategories for this category
        const subcategoriesData = await productsAPI.getSubcategories(category);
        // If API returns null (endpoint doesn't exist), use mock data
        setSubcategories(subcategoriesData || getMockSubcategories(category));
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, subcategory, sort]);

  // Sort products
  const sortProducts = (sortType) => {
    let sorted = [...products];
    switch(sortType) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        // featured - keep original order
        break;
    }
    setProducts(sorted);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Get current page data
  const getCurrentPageData = () => {
    if (categoryMetadata[category]) {
      const data = {
        title: categoryMetadata[category].title,
        description: categoryMetadata[category].description
      };
      return data;
    }
    return { title: 'Products', description: 'Browse our products' };
  };

  const pageData = getCurrentPageData();

  if (loading) {
    return (
      <Layout>
        <Head>
          <title>Loading... - ALCANSIDE</title>
        </Head>
        <div className="container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Head>
          <title>Error - ALCANSIDE</title>
        </Head>
        <div className="container py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{pageData.title} - ALCANSIDE</title>
        <meta name="description" content={pageData.description} />
        <meta name="keywords" content={`${pageData.title}, alcantara, premium accessories, ${category}`} />
        <meta property="og:title" content={`${pageData.title} - ALCANSIDE`} />
        <meta property="og:description" content={pageData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.alcanside.com/category/${category}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pageData.title} - ALCANSIDE`} />
        <meta name="twitter:description" content={pageData.description} />
        <link rel="canonical" href={`https://www.alcanside.com/category/${category}`} />
      </Head>
      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {Object.entries(categories).map(([name, count]) => (
                <Link
                  key={name}
                  href={`/category/${name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    pageData.title === name 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <span>{name}</span>
                  <span className="text-xs text-gray-500">({count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container py-8">
        {/* Breadcrumb for subcategory */}
        {subcategory && (
          <div className="mb-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href={`/category/${category}`} className="hover:text-primary-600 transition-colors">
                {pageData.title}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium capitalize">
                {subcategory.replace('-', ' ')}
              </span>
            </nav>
          </div>
        )}

        {/* Subcategory filter pills */}
        {subcategories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/category/${category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !subcategory 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </Link>
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/${category}?subcategory=${sub.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    subcategory === sub.slug 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {subcategory ? `${pageData.title} - ${subcategory.replace('-', ' ')}` : pageData.title}
            </h1>
            <p className="text-gray-600">{pageData.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {products.length} products found
              {subcategory && ` in ${subcategory.replace('-', ' ')}`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  sortProducts(e.target.value);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary-500"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid - Always show if products exist */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].altText || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-lg">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute top-2 left-2 space-y-1">
                      {product.isNew && (
                        <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                          NEW
                        </span>
                      )}
                      {product.isLimitedEdition && (
                        <span className="inline-block bg-purple-500 text-white text-xs px-2 py-1 rounded">
                          Limited Edition
                        </span>
                      )}
                      {product.isBlueMondaySale && (
                        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Blue Monday Sale
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.old_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.old_price}
                        </span>
                      )}
                    </div>

                    {product.shortDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - Only show if truly empty */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products available in this category
              </h3>
              <p className="text-gray-600 mb-6">
                Try browsing our other categories or check back later for new arrivals.
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {pageData.title}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Experience the luxury and sophistication of Alcantara with our premium {pageData.title.toLowerCase()}. 
              Each product is meticulously crafted to provide exceptional protection while maintaining an elegant aesthetic 
              that complements your lifestyle.
            </p>
            <p className="text-gray-600 mb-4">
              Alcantara is a unique material that combines the softness of fabric with the durability of leather, 
              making it the perfect choice for those who demand both style and functionality. Our {pageData.title.toLowerCase()} 
              feature precision engineering, attention to detail, and the finest materials to ensure your devices remain 
              protected in the most elegant way possible.
            </p>
            <p className="text-gray-600">
              Whether you're looking for everyday protection or a statement piece that reflects your personal style, 
              our collection offers something for everyone. Each item is designed to age beautifully, developing a 
              unique patina that tells your story over time.
            </p>
          </div>
        </div>

        {/* Recommended Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src="/api/placeholder/300/300"
                    alt="ALCANSIDE Screen Protector - iPhone 17 Pro"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    ALCANSIDE Screen Protector - iPhone 17 Pro
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">₹1,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
