import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useSupabaseCart } from '../contexts/SupabaseCartContext';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { addToCart } = useSupabaseCart();

  const getImageUrl = (image) => {
    if (!image) {
      return `https://picsum.photos/seed/${product?.name || 'product'}/300/300.jpg`;
    }
    
    // Handle full URLs
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Handle blob URLs (for admin panel preview)
    if (image.startsWith('blob:')) {
      return image;
    }
    
    // Handle data URLs
    if (image.startsWith('data:')) {
      return image;
    }
    
    // Handle relative paths starting with /
    if (image.startsWith('/')) {
      // If it's already a full path to uploads, use as is
      if (image.startsWith('/uploads/')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${image}`;
      }
      // Otherwise treat as absolute path
      return image;
    }
    
    // Handle relative paths without leading slash - assume uploads
    if (image.includes('uploads/') || image.includes('product-')) {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/uploads/images/${image}`;
    }
    
    // Handle test/placeholder images
    if (image.includes('test-image') || image.includes('placeholder')) {
      return `https://picsum.photos/seed/${product.name}/300/300.jpg`;
    }
    
    // Default fallback for any other case
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/uploads/images/${image}`;
  };

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
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        {/* Product Image */}
        <div className="relative bg-gray-50 h-64 overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${product.name}/300/300.jpg`;
                }}
              />
            ) : (
              <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Case</span>
              </div>
            )}
          
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
              {renderStars(product.average_rating || product.rating || 0)}
            </div>
            <span className="text-xs text-secondary-500">
              ({product.review_count || product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-primary-800">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-secondary-400 line-through">
                ₹{product.originalPrice}
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
