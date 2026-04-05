import React, { useState, useEffect } from 'react';
import EnhancedProductCard from '../EnhancedProductCard';
import ViewAllProductsButton from '../ViewAllProductsButton';
import { Grid } from 'lucide-react';
import apiClient from '../../lib/api';

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
      
      // Priority-based filtering: sub-subcategory first, then subcategory
      let apiUrl;
      
      // Priority 1: Try sub_subcategory (Level 3 - most specific)
      if (currentProduct.sub_subcategory) {
        apiUrl = `/products?sub_subcategory=${encodeURIComponent(currentProduct.sub_subcategory)}&exclude=${currentProduct.id}&limit=8`;
        console.log('🎯 Using sub-subcategory name:', currentProduct.sub_subcategory);
      }
      // Priority 2: Try subcategory (Level 2)
      else if (currentProduct.subcategory) {
        // Check if subcategory is a UUID
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentProduct.subcategory)) {
          apiUrl = `/products?subcategory=${currentProduct.subcategory}&exclude=${currentProduct.id}&limit=8`;
          console.log('🎯 Using subcategory UUID:', currentProduct.subcategory);
        } else {
          apiUrl = `/products?subcategory=${encodeURIComponent(currentProduct.subcategory)}&exclude=${currentProduct.id}&limit=8`;
          console.log('🎯 Using subcategory name:', currentProduct.subcategory);
        }
      }
      // Priority 3: Fallback to category
      else if (currentProduct.category) {
        apiUrl = `/products?category=${encodeURIComponent(currentProduct.category)}&exclude=${currentProduct.id}&limit=8`;
        console.log('🎯 Using category name:', currentProduct.category);
      } else {
        console.log('❌ No category info available');
        setRelatedProducts([]);
        setLoading(false);
        return;
      }
      
      console.log('🌐 Final API URL:', apiUrl);
      
      const response = await apiClient.get(apiUrl);
      const data = response.data;
      
      console.log('📦 API Response:', {
        status: response.status,
        url: apiUrl,
        data: data
      });
      
      if (response.status === 200) {
        const products = data.products || [];
        setRelatedProducts(products);
        console.log('✅ Related products found:', products.length);
        if (products.length === 0) {
          console.log('🔍 No products found. Current product categories:', {
            category: currentProduct.category,
            subcategory: currentProduct.subcategory,
            subcategory_id: currentProduct.subcategory_id,
            sub_subcategory: currentProduct.sub_subcategory,
            sub_subcategory_id: currentProduct.sub_subcategory_id
          });
        }
      } else {
        console.error('❌ Failed to fetch related products:', data.error);
        setRelatedProducts([]);
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
    return null; // Don't show anything if no related products found
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Grid className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover more products from the same sub-subcategory and subcategory
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Show loading skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-200 h-64"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : relatedProducts.length > 0 ? (
            // Show actual products
            relatedProducts.map((product, index) => (
              <EnhancedProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
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
          <ViewAllProductsButton 
            href={
              currentProduct.category 
                ? `/category/${encodeURIComponent(currentProduct.category.toLowerCase())}`
                : '/products'
            }
          />
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsBySubCategory;
