import React from 'react';
import ProductGridSection from '../components/ProductGridSection';

// Sample product data matching the images
const sampleProducts = [
  {
    id: 1,
    name: "Premium ΛʟcΛɴᴛ Phone Case",
    features: "Magsafe Compatible",
    price: 2999,
    originalPrice: 3999,
    rating: 4.5,
    review_count: 846,
    colors: ["#000000", "#10B981", "#3B82F6", "#EF4444", "#6B7280"],
    isBestseller: true,
    slug: "premium-ΛʟcΛɴᴛ-phone-case",
    image: null
  },
  {
    id: 2,
    name: "ΛʟcΛɴᴛ Travel Pillow",
    features: "Ergonomic Design",
    price: 3499,
    originalPrice: null,
    rating: 4.8,
    review_count: 324,
    colors: ["#1F2937", "#92400E", "#6B7280"],
    discount: 30,
    slug: "ΛʟcΛɴᴛ-travel-pillow",
    image: null
  },
  {
    id: 3,
    name: "iPhone 15 Pro Case - Black",
    features: "Premium Protection",
    price: 45,
    originalPrice: 65,
    rating: 0,
    review_count: 0,
    colors: ["#000000"],
    isLimited: true,
    slug: "iphone-15-pro-case-black",
    image: null
  },
  {
    id: 4,
    name: "iPhone 17 Pro - ΛʟcΛɴᴛ Case - Navy Blue",
    features: "Magsafe Compatible",
    price: 10400,
    originalPrice: 7800,
    rating: 5,
    review_count: 5642,
    colors: ["#1E3A8A", "#10B981", "#EF4444", "#6B7280", "#F59E0B"],
    slug: "iphone-17-pro-ΛʟcΛɴᴛ-case-navy-blue",
    image: null
  }
];

const ProductCardDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Product Card UI Demo</h1>
          <p className="text-gray-600 mt-2">Enhanced product cards with badges, color variants, and ratings</p>
        </div>
      </div>

      {/* Related Products Section */}
      <ProductGridSection 
        title="Related Products"
        products={sampleProducts}
        showViewAll={true}
        viewAllHref="/products"
        columns={4}
      />

      {/* Products with Filters */}
      <ProductGridSection 
        title="All Products"
        products={sampleProducts}
        showViewAll={true}
        viewAllHref="/products"
        columns={3}
        showFilters={true}
      />

      {/* Compact Grid */}
      <ProductGridSection 
        title="Featured Products"
        products={sampleProducts.slice(0, 2)}
        showViewAll={false}
        columns={2}
      />
    </div>
  );
};

export default ProductCardDemo;
