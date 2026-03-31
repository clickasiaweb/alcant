import React from 'react';
import ProductCard from '../ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RelatedProducts = ({ currentProduct }) => {
  // Sample related products data
  const relatedProducts = [
    {
      id: 1,
      name: 'Premium Leather Case',
      slug: 'premium-leather-case',
      price: 89.99,
      oldPrice: 119.99,
      image: 'https://picsum.photos/seed/leather-case/400/400.jpg',
      rating: 4.8,
      reviews: 234,
      isNew: true
    },
    {
      id: 2,
      name: 'Wireless Charging Pad',
      slug: 'wireless-charging-pad',
      price: 49.99,
      image: 'https://picsum.photos/seed/charging-pad/400/400.jpg',
      rating: 4.6,
      reviews: 189
    },
    {
      id: 3,
      name: 'Screen Protector Pro',
      slug: 'screen-protector-pro',
      price: 29.99,
      oldPrice: 39.99,
      image: 'https://picsum.photos/seed/screen-protector/400/400.jpg',
      rating: 4.7,
      reviews: 412
    },
    {
      id: 4,
      name: 'Travel Backpack',
      slug: 'travel-backpack',
      price: 149.99,
      image: 'https://picsum.photos/seed/backpack/400/400.jpg',
      rating: 4.9,
      reviews: 156
    },
    {
      id: 5,
      name: 'Smart Watch Band',
      slug: 'smart-watch-band',
      price: 39.99,
      image: 'https://picsum.photos/seed/watch-band/400/400.jpg',
      rating: 4.5,
      reviews: 89
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">More From Product Family</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover complementary products that complete your experience
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
