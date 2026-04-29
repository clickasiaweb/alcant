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
    
    // Handle full URLs (including Supabase storage URLs)
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
    
    // Handle test/placeholder images
    if (image.includes('test-image') || image.includes('placeholder')) {
      return `https://picsum.photos/seed/${product.name}/300/300.jpg`;
    }
    
    // Default fallback - assume it's a relative path and construct Supabase URL
    // This handles cases where image is just a filename like "product-123.jpg"
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && image) {
      return `${supabaseUrl}/storage/v1/object/public/products/${image}`;
    }
    
    // Final fallback
    return `https://picsum.photos/seed/${product.name}/300/300.jpg`;
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
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-amber-400 text-amber-400 opacity-60" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
      );
    }
    
    return stars;
  };

  const getColorHex = (colorName) => {
    const colors = {
      'navy blue': '#1E3A8A',
      'navy': '#1E3A8A',
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#DC2626',
      'blue': '#2563EB',
      'green': '#059669',
      'dark green': '#047857',
      'light green': '#10B981',
      'yellow': '#F59E0B',
      'purple': '#7C3AED',
      'orange': '#EA580C',
      'pink': '#EC4899',
      'rose gold': '#F43F5E',
      'rose': '#F43F5E',
      'brown': '#92400E',
      'tan': '#D97706',
      'beige': '#F5F5DC',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'silver': '#9CA3AF',
      'gold': '#FCD34D',
      'dark grey': '#374151',
      'light grey': '#E5E7EB',
      'dark gray': '#374151',
      'light gray': '#E5E7EB',
      'space grey': '#4B5563',
      'space gray': '#4B5563',
      'midnight green': '#1F2937',
      'sierra blue': '#0EA5E9',
      'alpine green': '#059669',
      'product red': '#DC2626'
    };
    return colors[colorName?.toLowerCase()] || colorName || '#CCCCCC';
  };

  // Extract colors from variants if available
  const availableColors = product.variants ? 
    product.variants.map(variant => ({
      name: variant.color || variant.name || 'Standard',
      hex: variant.hex || getColorHex(variant.color || variant.name),
      images: variant.images || []
    })).filter((color, index, self) => 
      self.findIndex(c => c.name === color.name) === index
    ) : [];

  const displayColors = availableColors.length > 0 ? availableColors : 
    (product.colors ? product.colors.map(color => ({
      name: color,
      hex: getColorHex(color)
    })) : []);

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

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.average_rating || product.rating || 0)}
            </div>
            <span className="text-xs text-gray-600 font-medium">
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

          {/* Color Variants - Enhanced display */}
          {displayColors.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              {displayColors.slice(0, 6).map((color, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full border-2 border-gray-400 shadow-md hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {displayColors.length > 6 && (
                <span className="text-xs text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded-full">
                  +{displayColors.length - 6}
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
