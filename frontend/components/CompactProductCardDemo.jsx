import React from 'react';
import CompactProductCard from './CompactProductCard';

const CompactProductCardDemo = () => {
  const sampleProducts = [
    {
      id: 1,
      name: 'iPhone 17 Pro Max - Alcantara Case - Space Grey',
      price: '7,700.00',
      originalPrice: '11,000.00',
      rating: 4.5,
      reviews: 5642,
      isBestseller: true,
      slug: 'iphone-17-pro-max-alcantara-case-space-grey',
      image: null
    },
    {
      id: 2,
      name: 'iPhone 16 Pro - Alcantara Case - Navy Blue',
      price: '6,500.00',
      originalPrice: '9,000.00',
      rating: 4.3,
      reviews: 3421,
      isBestseller: false,
      slug: 'iphone-16-pro-alcantara-case-navy-blue',
      image: null
    },
    {
      id: 3,
      name: 'iPhone 15 - Alcantara Case - Rose Gold',
      price: '5,200.00',
      originalPrice: '7,500.00',
      rating: 4.7,
      reviews: 8932,
      isBestseller: true,
      slug: 'iphone-15-alcantara-case-rose-gold',
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Compact Product Cards</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sampleProducts.map((product, index) => (
            <CompactProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactProductCardDemo;
