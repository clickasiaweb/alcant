import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product, index = 0 }) => {
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
      // Add product to cart using cart context
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
        <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-accent-500 text-accent-500 opacity-50" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-secondary-300" />
      );
    }
    
    return stars;
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-w-3 aspect-h-4 bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
          <div className="w-full h-64 flex items-center justify-center">
            <span className="text-primary-300 text-lg">Product Image</span>
          </div>
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </button>
              <WishlistButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  category: product.category,
                  variant: product.variant || 'Standard',
                  slug: product.slug
                }}
                size="sm"
                className="bg-white text-secondary-600 hover:bg-accent-50"
              />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {product.isNew && (
              <span className="inline-block bg-accent-500 text-white px-2 py-1 text-xs font-semibold rounded">
                NEW
              </span>
            )}
            {product.discount && (
              <span className="inline-block bg-primary-500 text-white px-2 py-1 text-xs font-semibold rounded">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <WishlistButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category,
                variant: product.variant || 'Standard',
                slug: product.slug
              }}
              size="sm"
              className="bg-white shadow-md"
            />
            <button
              onClick={handleQuickView}
              className={`p-2 bg-white rounded-lg shadow-md transition-all duration-300 ${
                isHovered 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-2'
              }`}
            >
              <Eye className="w-4 h-4 text-secondary-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-secondary-500 font-medium uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          
          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-medium text-primary-800 mb-2 hover:text-primary-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating || 4.5)}
            </div>
            <span className="text-xs text-secondary-500">
              ({product.reviews || 128})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-primary-800">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-secondary-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1 mt-3">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-ui-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-secondary-500 ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
