import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentProduct?.subcategory_id || currentProduct?.subcategoryId) {
      fetchRelatedProducts();
    }
  }, [currentProduct]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      const subcategoryId = currentProduct.subcategory_id || currentProduct.subcategoryId;
      
      const response = await fetch(
        `/api/products?subcategory_id=${subcategoryId}&exclude=${currentProduct.id}&limit=8`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setRelatedProducts(data.products || []);
      } else {
        console.error('Failed to fetch related products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Related Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Related Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover more products from the same category
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
            <ArrowRight className="w-6 h-6" />
          </button>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-8">
            {relatedProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
