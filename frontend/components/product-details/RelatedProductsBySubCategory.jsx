import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import { ArrowLeft, ArrowRight, Grid } from 'lucide-react';

const RelatedProductsBySubCategory = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 RelatedProductsBySubCategory - useEffect triggered');
    console.log('📋 Current Product:', currentProduct);
    
    if (currentProduct) {
      console.log('✅ Product exists, fetching related products...');
      fetchRelatedProducts();
    } else {
      console.log('❌ No product provided');
    }
  }, [currentProduct]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      
      // Try multiple subcategory levels for better matching
      let apiUrl;
      
      // Priority 1: Try sub_subcategory_id (most specific)
      if (currentProduct.sub_subcategory_id) {
        apiUrl = `/api/products?sub_subcategory_id=${currentProduct.sub_subcategory_id}&exclude=${currentProduct.id}&limit=8`;
        console.log('🎯 Using sub_subcategory_id:', currentProduct.sub_subcategory_id);
      }
      // Priority 2: Try subcategory_id
      else if (currentProduct.subcategoryId) {
        apiUrl = `/api/products?subcategory_id=${currentProduct.subcategoryId}&exclude=${currentProduct.id}&limit=8`;
        console.log('🎯 Using subcategory_id:', currentProduct.subcategoryId);
      }
      // Priority 3: Try subcategory name
      else if (currentProduct.subcategory) {
        apiUrl = `/api/products?subcategory=${encodeURIComponent(currentProduct.subcategory)}&exclude=${currentProduct.id}&limit=8`;
        console.log('🎯 Using subcategory name:', currentProduct.subcategory);
      }
      // Priority 4: Fallback to category name
      else if (currentProduct.category) {
        apiUrl = `/api/products?category=${encodeURIComponent(currentProduct.category)}&exclude=${currentProduct.id}&limit=8`;
        console.log('� Using category name:', currentProduct.category);
      }
      // Final fallback
      else {
        console.log('❌ No category info available');
        setRelatedProducts([]);
        setLoading(false);
        return;
      }
      
      console.log('🌐 Final API URL:', apiUrl);
      
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
        
        {/* Always show section title */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Related Products {loading && '(Loading...)'}
          </h3>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Show loading skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="bg-gray-200 h-40 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : relatedProducts.length > 0 ? (
            // Show actual products
            relatedProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            // Show no products message
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No related products found in this category.</p>
            </div>
          )}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              // Navigate to category page
              const categoryPath = currentProduct.category 
                ? `/category/${encodeURIComponent(currentProduct.category.toLowerCase())}`
                : '/products';
              console.log('🔗 Navigating to:', categoryPath);
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
