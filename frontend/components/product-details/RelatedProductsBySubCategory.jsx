import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import { ArrowLeft, ArrowRight, Grid } from 'lucide-react';

const RelatedProductsBySubCategory = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentProduct) {
      console.log('🔍 Current Product:', currentProduct);
      console.log('📋 Product Fields:', {
        id: currentProduct.id,
        name: currentProduct.name,
        category: currentProduct.category,
        subcategory: currentProduct.subcategory,
        subcategoryId: currentProduct.subcategoryId,
        sub_subcategory: currentProduct.sub_subcategory,
        sub_subcategory_id: currentProduct.sub_subcategory_id
      });
      fetchRelatedProducts();
    }
  }, [currentProduct]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      
      // Use category name for reliable matching
      const category = currentProduct.category;
      const apiUrl = `/api/products?category=${encodeURIComponent(category)}&exclude=${currentProduct.id}&limit=8`;
      
      console.log('🌐 Fetching related products:', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log('📦 API Response:', {
        ok: response.ok,
        status: response.status,
        data: data
      });
      
      if (response.ok) {
        setRelatedProducts(data.products || []);
        console.log('✅ Related products found:', data.products?.length || 0);
      } else {
        console.error('❌ Failed to fetch related products:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
            <p className="text-gray-600">Loading products from same category...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="bg-gray-200 h-40 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Grid className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Products in Same Category</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover more products from the same category and sub-category
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div key={product.id} className="group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              // Navigate to category page
              const categoryPath = currentProduct.category 
                ? `/category/${encodeURIComponent(currentProduct.category.toLowerCase())}`
                : '/products';
              window.location.href = categoryPath;
            }}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center"
          >
            <Grid className="w-5 h-5 mr-2" />
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsBySubCategory;
