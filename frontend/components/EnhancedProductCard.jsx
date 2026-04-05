import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, ShoppingBag, Star, Plus, Grid } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import WishlistButton from './WishlistButton';

const EnhancedProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product-details/${product.slug}`);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log('Adding to cart:', product);
      addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'bestseller':
        return 'bg-blue-500';
      case 'limited edition':
        return 'bg-purple-500';
      default:
        if (badge?.includes('%') || badge?.includes('off')) {
          return 'bg-red-500';
        }
        return 'bg-green-500';
    }
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        {/* Product Image */}
        <div className="relative bg-gray-50 h-64 overflow-hidden flex items-center justify-center">
          <div className="w-full h-64 flex items-center justify-center bg-gray-50">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain p-3"
              />
            ) : (
              <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Case</span>
              </div>
            )}
          </div>
          
          {/* Top Right Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button
              onClick={handleQuickAdd}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.isBestseller && (
              <span className="inline-block bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
                Bestseller
              </span>
            )}
            {product.discount && (
              <span className="inline-block bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                {product.discount}% Off
              </span>
            )}
            {product.isLimited && (
              <span className="inline-block bg-purple-500 text-white px-2 py-1 text-xs font-semibold rounded">
                Limited Edition
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Features/Compatibility */}
          {product.features && (
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-600 flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                {product.features}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.average_rating || product.rating || 0)}
            </div>
            <span className="text-xs text-gray-500">
              ({product.review_count || product.reviews || 0})
            </span>
          </div>

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              {product.colors.slice(0, 5).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductCard;
