import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Heart, ShoppingBag, Eye, Trash2, Plus, Minus } from 'lucide-react';

const WishlistPage = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock wishlist data
  const mockWishlistItems = [
    {
      id: 1,
      name: 'Premium Industrial Automation System',
      slug: 'premium-industrial-automation-system',
      price: 25000,
      originalPrice: 28000,
      rating: 4.8,
      reviews: 324,
      image: 'https://via.placeholder.com/300x300/1a365d/ffffff?text=Automation',
      category: 'Automation',
      inStock: true,
      isNew: true,
      discount: 10,
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      name: 'Precision CNC Machine',
      slug: 'precision-cnc-machine',
      price: 180000,
      rating: 4.9,
      reviews: 128,
      image: 'https://via.placeholder.com/300x300/2c5282/ffffff?text=CNC',
      category: 'Machinery',
      inStock: true,
      dateAdded: '2024-01-12'
    },
    {
      id: 3,
      name: 'Industrial Robot Arm',
      slug: 'industrial-robot-arm',
      price: 45000,
      rating: 4.8,
      reviews: 256,
      image: 'https://via.placeholder.com/300x300/3182ce/ffffff?text=Robot',
      category: 'Robotics',
      inStock: false,
      dateAdded: '2024-01-10'
    },
    {
      id: 4,
      name: 'Quality Control System',
      slug: 'quality-control-system',
      price: 15000,
      rating: 4.7,
      reviews: 89,
      image: 'https://via.placeholder.com/300x300/2b6cb0/ffffff?text=QC',
      category: 'Quality Control',
      inStock: true,
      dateAdded: '2024-01-08'
    }
  ];

  useEffect(() => {
    // Simulate loading wishlist data
    const loadWishlist = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    };
    
    loadWishlist();
  }, []);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (id) => {
    // Mock add to cart functionality
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      // In a real app, this would update the cart state
      alert(`${item.name} added to cart!`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 opacity-50">★</span>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <Layout title="My Wishlist">
        <div className="container py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Wishlist">
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <div className="flex items-center text-gray-600">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                <span>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8">
                  Start adding products you love to keep them all in one place.
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                {/* Wishlist Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 space-y-2">
                          {item.isNew && (
                            <span className="inline-block bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                              NEW
                            </span>
                          )}
                          {item.discount && (
                            <span className="inline-block bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                              -{item.discount}%
                            </span>
                          )}
                          {!item.inStock && (
                            <span className="inline-block bg-gray-500 text-white px-2 py-1 text-xs font-semibold rounded">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>

                        {/* Quick Actions */}
                        <div className="absolute bottom-4 left-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => router.push(`/products/${item.slug}`)}
                            className="flex-1 bg-white text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => addToCart(item.id)}
                            disabled={!item.inStock}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                              item.inStock
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4 mr-1" />
                            {item.inStock ? 'Add to Cart' : 'Unavailable'}
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category */}
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                          {item.category}
                        </p>
                        
                        {/* Product Name */}
                        <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer"
                            onClick={() => router.push(`/products/${item.slug}`)}>
                          {item.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-xs text-gray-600 ml-2">
                            ({item.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-lg font-semibold text-gray-900">
                            ${item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Date Added */}
                        <p className="text-xs text-gray-500">
                          Added on {new Date(item.dateAdded).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Wishlist Actions */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Ready to checkout?
                      </h3>
                      <p className="text-gray-600">
                        Add items from your wishlist to cart and proceed to checkout.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          // Add all items to cart
                          wishlistItems.forEach(item => {
                            if (item.inStock) {
                              addToCart(item.id);
                            }
                          });
                        }}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        Add All to Cart
                      </button>
                      <button
                        onClick={() => router.push('/products')}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
