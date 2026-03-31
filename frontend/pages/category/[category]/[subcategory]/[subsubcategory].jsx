import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../../components/Layout';
import Link from 'next/link';
import Star from 'lucide-react/dist/esm/icons/star';
import Filter from 'lucide-react/dist/esm/icons/filter';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import CompactProductCard from '../../../../components/CompactProductCard';
import FilterSidebar from '../../../../components/FilterSidebar';
import { fetchCategories, fetchProducts, fetchRecommendedProducts } from '../../../../lib/services';

const SubSubCategoryPage = () => {
  const router = useRouter();
  const { category, subcategory, subsubcategory } = router.query;

  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ title: '', description: '' });
  const [subSubCategoryId, setSubSubCategoryId] = useState(null);
  const [filters, setFilters] = useState({ 
    brand: '', 
    min: '', 
    max: '', 
    availability: '',
    colors: [],
    iphoneModel: [],
    typeCase: [],
    magSafe: false,
    partnership: [],
    search: ""
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, hasMore: false });
  const [allCategories, setAllCategories] = useState([]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Resolve sub-subcategory id from slugs
  useEffect(() => {
    const resolveMetaAndId = async () => {
      try {
        // Use hierarchy API to get the proper structure
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/hierarchy`);
        const data = await response.json();
        const categories = data.data || [];
        setAllCategories(categories);
        
        const catNode = categories.find((c) => c.slug === category);
        const subNode = catNode?.subcategories?.find((s) => s.slug === subcategory);
        const subSubNode = subNode?.sub_subcategories?.find((ss) => ss.slug === subsubcategory);
        
        console.log('🔍 Finding sub-subcategory:', { category, subcategory, subsubcategory });
        console.log('📁 Found nodes:', { catNode, subNode, subSubNode });
        
        setSubSubCategoryId(subSubNode?.id || null);
        const title = subSubNode?.name || subNode?.name || catNode?.name || 'Products';
        const description = subSubNode ? `${subSubNode.name} from ${subNode?.name} in ${catNode?.name}` : 
                             subNode ? `${subNode.name} from ${catNode?.name}` : 
                             catNode?.name || 'Browse our products';
        setMeta({ title, description });
      } catch (e) {
        console.error('❌ Error resolving sub-subcategory:', e);
        setMeta({ title: 'Products', description: 'Browse our products' });
      }
    };
    if (category && subcategory && subsubcategory) resolveMetaAndId();
  }, [category, subcategory, subsubcategory]);

  // Fetch products when filters/sort/page change
  useEffect(() => {
    const load = async () => {
      if (!subSubCategoryId) return;
      setLoading(true);
      try {
        const { products: items, pagination: p } = await fetchProducts({
          sub_subcategory_id: subSubCategoryId,
          page: pagination.page,
          limit: pagination.limit,
          sort: sortBy,
          brand: filters.brand,
          min_price: filters.min,
          max_price: filters.max,
          availability: filters.availability,
          colors: filters.colors,
          iphoneModel: filters.iphoneModel,
          typeCase: filters.typeCase,
          magSafe: filters.magSafe,
          partnership: filters.partnership,
          search: filters.search
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
  }, [subSubCategoryId, sortBy, filters.brand, filters.min, filters.max, filters.availability, filters.colors, filters.iphoneModel, filters.typeCase, filters.magSafe, filters.partnership, filters.search, pagination.page]);

  // Fetch recommended excluding current ids
  useEffect(() => {
    const loadRec = async () => {
      if (!subSubCategoryId) return;
      try {
        const exclude = products.map((p) => p._id).join(',');
        const { products: rec } = await fetchRecommendedProducts({ sub_subcategory_id: subSubCategoryId, exclude });
        setRecommended(rec || []);
      } catch (e) {
        setRecommended([]);
      }
    };
    loadRec();
  }, [subSubCategoryId, products]);

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
        <meta name="keywords" content={`${meta.title}, alcantara, premium accessories, ${category}, ${subcategory || ''}, ${subsubcategory || ''}`} />
        <meta property="og:title" content={`${meta.title} - ALCANSIDE`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.alcanside.com/category/${category}${subcategory ? `/${subcategory}` : ''}${subsubcategory ? `/${subsubcategory}` : ''}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${meta.title} - ALCANSIDE`} />
        <meta name="twitter:description" content={meta.description} />
        <link rel="canonical" href={`https://www.alcanside.com/category/${category}${subcategory ? `/${subcategory}` : ''}${subsubcategory ? `/${subsubcategory}` : ''}`} />
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
              <Link href={`/category/${category}/${subcategory}`} className="hover:text-primary-600 capitalize">
                {subcategory.replace('-', ' ')}
              </Link>
            </>
          )}
          {subsubcategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 capitalize">{subsubcategory.replace('-', ' ')}</span>
            </>
          )}
        </nav>
      </div>

      {/* Error State */}
      {!subSubCategoryId && category && subcategory && subsubcategory && (
        <div className="container py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Category Not Found</h2>
            <p className="text-yellow-700 mb-4">
              The sub-subcategory "{subsubcategory}" was not found in "{subcategory}" → "{category}".
            </p>
            <Link href="/category" className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Browse All Categories
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gray-100 text-primary-900 py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {meta.title}
            </h1>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto">
              {meta.description}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Results Section */}
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64">
              <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {products.length}
                      </span>{" "}
                      {meta.title.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
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
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 lg:hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              )}

              {/* Products Grid */}
              {products.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium mb-2">
                      No products available in this category
                    </p>
                    <p className="text-sm">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <CompactProductCard
                      key={product._id}
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        rating: product.rating || 4.5,
                        reviews: product.reviews || Math.floor(Math.random() * 1000) + 100,
                        isBestseller: index === 0, // First product is bestseller
                        discount: index === 1 ? 30 : null, // Second product has 30% off
                        isLimited: index === 2, // Third product is limited edition
                        isNew: product.isNew,
                        slug: product.slug,
                        image: product.images && product.images.length > 0 ? product.images[0].url : null,
                        colorCount: product.colors ? product.colors.length : 8
                      }}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Recommended Section */}
              {recommended.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommended.map((product, index) => (
                      <CompactProductCard
                        key={product._id}
                        product={{
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          rating: product.rating || 4.5,
                          reviews: product.reviews || Math.floor(Math.random() * 1000) + 100,
                          isBestseller: index === 0,
                          discount: index === 1 ? 20 : null,
                          isLimited: index === 2,
                          isNew: product.isNew,
                          slug: product.slug,
                          image: product.images && product.images.length > 0 ? product.images[0].url : null,
                          colorCount: product.colors ? product.colors.length : 8
                        }}
                        index={index}
                      />
                    ))}
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

export default SubSubCategoryPage;
