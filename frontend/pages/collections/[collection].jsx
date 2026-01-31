import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Star from 'lucide-react/dist/esm/icons/star';

const CollectionPage = () => {
  const router = useRouter();
  const { collection } = router.query;

  // Collection data
  const collectionsData = {
    'phone-cases': {
      title: 'Phone Cases Collection',
      description: 'Explore our complete collection of premium Alcantara phone cases',
      products: [
        {
          id: 1,
          name: 'iPhone 15 Pro Alcantara Case - Space Gray',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 211,
          price: 3500,
          oldPrice: 4000,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: false,
        },
        {
          id: 2,
          name: 'iPhone 15 Pro Alcantara Case - Orange',
          image: '/api/placeholder/300/300',
          rating: 4,
          reviews: 180,
          price: 3500,
          oldPrice: 4000,
          isNew: true,
          isLimitedEdition: false,
          isBlueMondaySale: false,
        },
        {
          id: 3,
          name: 'iPhone 15 Pro Alcantara Case - Dream Blue',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 230,
          price: 2600,
          oldPrice: 3000,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: true,
        },
        {
          id: 4,
          name: 'iPhone 15 Pro Alcantara Case - Navy Blue',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 195,
          price: 3900,
          oldPrice: 4500,
          isNew: false,
          isLimitedEdition: true,
          isBlueMondaySale: false,
        }
      ]
    },
    'accessories': {
      title: 'Accessories Collection',
      description: 'Discover our premium Alcantara accessories for your devices',
      products: [
        {
          id: 8,
          name: 'AirPods Pro 3rd Generation Alcantara Case - Space Gray',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 245,
          price: 2800,
          oldPrice: 3200,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: true,
        },
        {
          id: 9,
          name: 'AirPods Pro 3rd Generation Alcantara Case - Orange',
          image: '/api/placeholder/300/300',
          rating: 4,
          reviews: 198,
          price: 2800,
          oldPrice: 3200,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: false,
        }
      ]
    },
    'wallets': {
      title: 'Wallets Collection',
      description: 'Premium Alcantara wallets and card holders',
      products: [
        {
          id: 21,
          name: 'Alcantara Leather Wallet - Black',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 189,
          price: 4500,
          oldPrice: null,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: false,
        }
      ]
    },
    'office': {
      title: 'Office Collection',
      description: 'Premium Alcantara office accessories',
      products: [
        {
          id: 23,
          name: 'Alcantara Desk Organizer - Navy Blue',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 98,
          price: 5500,
          oldPrice: null,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: false,
        }
      ]
    },
    'car-travel': {
      title: 'Car & Travel Collection',
      description: 'Premium Alcantara car and travel accessories',
      products: [
        {
          id: 24,
          name: 'Alcantara Car Organizer - Black',
          image: '/api/placeholder/300/300',
          rating: 4,
          reviews: 123,
          price: 3800,
          oldPrice: null,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: false,
        }
      ]
    },
    'sale': {
      title: 'Sale Collection',
      description: 'Special offers and discounted items',
      products: [
        {
          id: 25,
          name: 'iPhone 15 Pro Alcantara Case - Dream Blue',
          image: '/api/placeholder/300/300',
          rating: 5,
          reviews: 230,
          price: 2600,
          oldPrice: 3000,
          isNew: false,
          isLimitedEdition: false,
          isBlueMondaySale: true,
        }
      ]
    }
  };

  const collectionData = collectionsData[collection] || collectionsData['phone-cases'];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (!collectionData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={`${collectionData.title} - ALCANSIDE`} description={collectionData.description}>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {collectionData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {collectionData.description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {collectionData.products.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary-300 transition-colors">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-2 left-2 space-y-1">
                    {product.isNew && (
                      <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                    {product.isLimitedEdition && (
                      <span className="inline-block bg-purple-500 text-white text-xs px-2 py-1 rounded">
                        Limited Edition
                      </span>
                    )}
                    {product.isBlueMondaySale && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Blue Monday Sale
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.oldPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Description */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Collection</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Experience the luxury and sophistication of Alcantara with our premium {collectionData.title.toLowerCase()}. 
              Each product is meticulously crafted to provide exceptional protection while maintaining an elegant aesthetic 
              that complements your lifestyle.
            </p>
            <p className="text-gray-600 mb-4">
              Alcantara is a unique material that combines the softness of fabric with the durability of leather, 
              making it the perfect choice for those who demand both style and functionality. Our {collectionData.title.toLowerCase()} 
              feature precision engineering, attention to detail, and the finest materials to ensure your devices remain 
              protected in the most elegant way possible.
            </p>
            <p className="text-gray-600">
              Whether you're looking for everyday protection or a statement piece that reflects your personal style, 
              our collection offers something for everyone. Each item is designed to age beautifully, developing a 
              unique patina that tells your story over time.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionPage;
