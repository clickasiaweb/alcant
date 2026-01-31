import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import Star from 'lucide-react/dist/esm/icons/star';
import Filter from 'lucide-react/dist/esm/icons/filter';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { fetchCategories, fetchProducts, fetchRecommendedProducts } from '../../../lib/services';

const CategoryPage = () => {
  const router = useRouter();
  const { category, subcategory } = router.query;

  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ title: '', description: '' });
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [filters, setFilters] = useState({ brand: '', min: '', max: '', availability: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, hasMore: false });
  const [allCategories, setAllCategories] = useState([]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  // Resolve subcategory id from slugs
  useEffect(() => {
    const resolveMetaAndId = async () => {
      try {
        const data = await fetchCategories();
        const categories = data.categories || [];
        setAllCategories(categories);
        const catNode = categories.find((c) => c.slug === category);
        const subNode = catNode?.subcategories?.find((s) => s.slug === subcategory);
        setSubCategoryId(subNode?._id || null);
        const title = subNode?.name || catNode?.name || 'Products';
        const description = subNode ? `${subNode.name} from ${catNode?.name}` : catNode?.name || 'Browse our products';
        setMeta({ title, description });
      } catch (e) {
        setMeta({ title: 'Products', description: 'Browse our products' });
      }
    };
    if (category) resolveMetaAndId();
  }, [category, subcategory]);

  // Fetch products when filters/sort/page change
  useEffect(() => {
    const load = async () => {
      if (!subCategoryId) return;
      setLoading(true);
      try {
        const { products: items, pagination: p } = await fetchProducts({
          subcategory_id: subCategoryId,
          page: pagination.page,
          limit: pagination.limit,
          sort: sortBy,
          brand: filters.brand,
          min_price: filters.min,
          max_price: filters.max,
          availability: filters.availability,
        });
        setProducts(items || []);
        setPagination((prev) => ({ ...prev, ...p }));
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryId, sortBy, filters.brand, filters.min, filters.max, filters.availability, pagination.page]);

  // Fetch recommended excluding current ids
  useEffect(() => {
    const loadRec = async () => {
      if (!subCategoryId) return;
      try {
        const exclude = products.map((p) => p._id).join(',');
        const { products: rec } = await fetchRecommendedProducts({ subcategory_id: subCategoryId, exclude });
        setRecommended(rec || []);
      } catch (e) {
        setRecommended([]);
      }
    };
    loadRec();
  }, [subCategoryId, products]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    allCategories.forEach((c) => {
      let total = 0;
      c.subcategories?.forEach(() => (total += 0)); // placeholder if you later wire counts
      counts[c.slug] = total;
    });
    return counts;
  }, [allCategories]);

  const onSortChange = (value) => {
    setSortBy(value);
  };

  if (loading && !products.length) {
    return (
      <Layout title="Loading..." description="Loading products...">
        <div className="container py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{meta.title} - ALCANSIDE</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={`${meta.title}, alcantara, premium accessories, ${category}, ${subcategory || ''}`} />
        <meta property="og:title" content={`${meta.title} - ALCANSIDE`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.alcanside.com/category/${category}${subcategory ? `/${subcategory}` : ''}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${meta.title} - ALCANSIDE`} />
        <meta name="twitter:description" content={meta.description} />
        <link rel="canonical" href={`https://www.alcanside.com/category/${category}${subcategory ? `/${subcategory}` : ''}`} />
      </Head>

      {/* Breadcrumb Navigation */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href={`/category/${category}`} className="hover:text-primary-600 capitalize">
            {category?.replace('-', ' ')}
          </Link>
          {subcategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 capitalize">{subcategory.replace('-', ' ')}</span>
            </>
          )}
        </nav>
      </div>

      {/* Header */}
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{meta.title}</h1>
            <p className="text-gray-600">{meta.description}</p>
            <p className="text-sm text-gray-500 mt-2">{products.length} products found</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-expanded={showFilters}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary-500"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Brand (comma separated)"
              value={filters.brand}
              onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Min price"
              value={filters.min}
              onChange={(e) => setFilters((f) => ({ ...f, min: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.max}
              onChange={(e) => setFilters((f) => ({ ...f, max: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <select
              value={filters.availability}
              onChange={(e) => setFilters((f) => ({ ...f, availability: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Availability</option>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available in this category</h3>
              <p className="text-gray-600 mb-6">Try browsing our other categories or check back later for new arrivals.</p>
              <Link href="/" className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div key={product._id} className="group">
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img
                        src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">{renderStars(product.rating)}</div>
                      <span className="text-sm text-gray-500">({product.reviews || 0})</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((product) => (
                <div key={product._id} className="group">
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img
                        src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
