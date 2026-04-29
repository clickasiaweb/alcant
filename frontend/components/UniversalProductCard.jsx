import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Plus, Star } from 'lucide-react';
import { useSupabaseCart } from '../contexts/SupabaseCartContext';

const UniversalProductCard = ({ product, index = 0 }) => {
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && image) {
      return `${supabaseUrl}/storage/v1/object/public/products/${image}`;
    }
    
    // Final fallback
    return `https://picsum.photos/seed/${product.name}/300/300.jpg`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log('Adding to cart:', product);
      addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(e);
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

  const getColorHex = (colorName) => {
    const colors = {
      'navy blue': '#000080',
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'dark green': '#006400',
      'light green': '#90EE90',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'orange': '#FFA500',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'gray': '#808080',
      'grey': '#808080',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'dark grey': '#4A4A4A',
      'light grey': '#D3D3D3',
      'dark gray': '#4A4A4A',
      'light gray': '#D3D3D3'
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
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        {/* Product Image */}
        <div className="relative bg-gray-50 h-64 overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${product.name}/300/300.jpg`;
              }}
            />
          ) : (
            <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Case</span>
            </div>
          )}

          {/* Top Right Actions - Fixed positioning like in the image */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleQuickAdd}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              title="Quick Add"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Feature/Compatibility - Magsafe Compatible style */}
          {product.features && (
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-600 flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                {product.features}
              </span>
            </div>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {renderStars(product.average_rating || product.rating || 0)}
            </div>
            <span className="text-xs text-gray-500">
              ({product.review_count || product.reviews || 0})
            </span>
          </div>

          {/* Color Variants - Matching the image design */}
          {displayColors.length > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              {displayColors.slice(0, 6).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {displayColors.length > 6 && (
                <span className="text-xs text-gray-500 ml-1 font-medium">
                  +{displayColors.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
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

export default UniversalProductCard;
