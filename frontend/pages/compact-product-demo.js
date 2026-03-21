import React from 'react';
import Head from 'next/head';
import CompactProductCard from '../components/CompactProductCard';

const CompactProductDemo = () => {
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
    },
    {
      id: 4,
      name: 'iPhone 14 Pro - Alcantara Case - Midnight Black',
      price: '4,800.00',
      originalPrice: '6,900.00',
      rating: 4.4,
      reviews: 2156,
      isBestseller: false,
      slug: 'iphone-14-pro-alcantara-case-midnight-black',
      image: null
    },
    {
      id: 5,
      name: 'iPhone 13 - Alcantara Case - Pearl White',
      price: '3,900.00',
      originalPrice: '5,500.00',
      rating: 4.6,
      reviews: 4321,
      isBestseller: false,
      slug: 'iphone-13-alcantara-case-pearl-white',
      image: null
    }
  ];

  return (
    <>
      <Head>
        <title>Compact Product Card Demo</title>
        <meta name="description" content="Compact product card demonstration" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Compact Product Cards</h1>
            <p className="text-gray-600">Small text product display cards inspired by the reference design</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sampleProducts.map((product, index) => (
              <CompactProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Small text sizing for compact display</li>
              <li>• Bestseller badge indicator</li>
              <li>• Hover effects for cart actions</li>
              <li>• Star ratings with review counts</li>
              <li>• Color swatches with +more indicator</li>
              <li>• Discounted pricing display</li>
              <li>• Responsive grid layout</li>
              <li>• Magsafe compatibility tag</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompactProductDemo;
