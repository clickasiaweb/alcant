import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../services/apiService';
import { getCategories } from '../../services/categoryService';

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug && slug.length > 0) {
      loadCategoryProducts();
    }
  }, [slug]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build category filter based on slug length
      let categoryFilter = {};
      
      if (slug.length === 1) {
        // Main category: /category/[categoryId]
        categoryFilter = { categoryId: slug[0] };
      } else if (slug.length === 2) {
        // Sub category: /category/[categoryId]/[subCategoryId]
        categoryFilter = { 
          categoryId: slug[0], 
          subCategoryId: slug[1] 
        };
      } else if (slug.length === 3) {
        // Sub-sub category: /category/[categoryId]/[subCategoryId]/[subSubCategoryId]
        categoryFilter = { 
          categoryId: slug[0], 
          subCategoryId: slug[1],
          subSubCategoryId: slug[2]
        };
      }

      // Fetch products with category filter
      const response = await getProducts({ 
        ...categoryFilter,
        limit: 50,
        isActive: true
      });

      // Fetch category information for breadcrumb
      const categoriesResponse = await getCategories();
      const categoryData = buildCategoryInfo(categoriesResponse.data || [], slug);
      
      setCategoryInfo(categoryData);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error loading category products:', err);
      setError('Failed to load products for this category');
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryInfo = (categories, slug) => {
    // This is a simplified version - in a real implementation, 
    // you'd build the full hierarchy from the categories data
    const levelNames = ['Category', 'Subcategory', 'Sub-subcategory', 'Level 4 Category'];
    const breadcrumb = slug.map((id, index) => ({
      id,
      name: `${levelNames[index]} ${id}`,
      level: index + 1
    }));

    return {
      breadcrumb,
      title: breadcrumb[breadcrumb.length - 1]?.name || 'Category',
      description: `Browse products in ${breadcrumb[breadcrumb.length - 1]?.name || 'this category'}`
    };
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
    <Layout title={`${categoryInfo?.title || 'Category'} - ΛʟcΛɴᴛ`} description={categoryInfo?.description}>
      <div className="container py-8">
        {/* Breadcrumb */}
        {categoryInfo?.breadcrumb && (
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Home
                </button>
              </li>
              {categoryInfo.breadcrumb.map((item, index) => (
                <li key={item.id} className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className={index === categoryInfo.breadcrumb.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {categoryInfo?.title || 'Category'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categoryInfo?.description || 'Browse our collection of premium products'}
          </p>
        </div>

        {/* Products Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                There are currently no products available in this category.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Browse All Products
              </button>
            </div>
          </div>
        )}

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Category</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Experience the luxury and sophistication of ΛʟcΛɴᴛ with our premium products in this category. 
              Each product is meticulously crafted to provide exceptional quality while maintaining an elegant aesthetic 
              that complements your lifestyle.
            </p>
            <p className="text-gray-600 mb-4">
              ΛʟcΛɴᴛ is a unique material that combines the softness of fabric with the durability of leather, 
              making it the perfect choice for those who demand both style and functionality. Our products in this category 
              feature precision engineering, attention to detail, and the finest materials to ensure you receive 
              the best possible experience.
            </p>
            <p className="text-gray-600">
              Whether you're looking for everyday essentials or statement pieces that reflect your personal style, 
              this category offers something for everyone. Each item is designed to age beautifully, developing a 
              unique patina that tells your story over time.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
