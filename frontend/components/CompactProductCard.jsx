import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { useSupabaseCart } from '../contexts/SupabaseCartContext';

const CompactProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useSupabaseCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
      );
    }
    if (hasHalf) {
      stars.push(
        <Star key="half" className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
      );
    }
    const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < remaining; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
      );
    }
    return stars;
  };

  const colors = [
    '#3D3D3D', // Space Grey
    '#1A5C2A', // Dark Green
    '#1E3A8A', // Navy Blue
    '#7B1C1C', // Maroon
    '#9CA3AF', // Light Grey
  ];

  const extraColors = Math.max(0, (product.colorCount || 8) - colors.length);

  return (
    <Link href={`/product-details/${product.slug}`} className="block">
      <div
        className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Image Container */}
      <div className="relative bg-gray-50 h-48 sm:h-56 md:h-64 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 sm:p-3"
          />
        ) : (
          <div className="w-24 h-32 sm:w-32 sm:h-40 bg-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-xs sm:text-sm">Case</span>
          </div>
        )}

        {/* Badges - Top Left */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          {product.isBestseller && (
            <span className="bg-blue-600 text-white px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-full inline-block">
              Bestseller
            </span>
          )}
          {product.discount && !product.isBestseller && (
            <span className="bg-red-500 text-white px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-full inline-block">
              {product.discount}% Off
            </span>
          )}
          {product.isLimited && !product.isBestseller && !product.discount && (
            <span className="bg-purple-600 text-white px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-full inline-block">
              Limited Edition
            </span>
          )}
        </div>

        {/* Cart & Plus Buttons stacked top-right */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col space-y-1 sm:space-y-1.5">
          <button
            onClick={handleQuickAdd}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" />
          </button>
          <button
            onClick={handleQuickAdd}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
        {/* Product Name */}
        <Link href={`/product-details/${product.slug}`}>
          <h3 className="text-[12px] sm:text-[14px] font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-2">
            {product.name || 'iPhone 17 Pro Max - ΛʟcΛɴᴛ Case - Space Grey'}
          </h3>
        </Link>

        {/* Magsafe Tag */}
        <div className="flex items-center space-x-1 mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-[11px] text-gray-500">•</span>
          <span className="text-[10px] sm:text-[11px] text-gray-500">Magsafe Compatible</span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2 sm:mb-3">
          <div className="flex items-center">
            {renderStars(product.rating || 5)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-500">
            ({(product.reviews || 5642).toLocaleString()})
          </span>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 mb-3 sm:mb-4">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-[10px] sm:text-[11px] text-gray-500 ml-0.5">+3</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-[13px] sm:text-[15px] font-bold text-gray-900">
            ₹{product.price || '7,700.00'}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-[12px] text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
};

export default CompactProductCard;
