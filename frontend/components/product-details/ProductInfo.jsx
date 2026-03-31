import React, { useState } from 'react';
import { ShoppingCart, Share2, Star, Plus, Minus, Truck, Shield, RotateCcw, Package, Clock, Award } from 'lucide-react';

const ProductInfo = ({ 
  product, 
  displayName, 
  displayDescription, 
  currentPrice, 
  oldPrice, 
  quantity, 
  handleQuantityChange, 
  handleAddToCart, 
  handleShare,
  onColorChange,
  images = []
}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  
  const discountPercentage = oldPrice && oldPrice > currentPrice ? 
    Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  // Extract available colors from product variants or use defaults
  const availableColors = product.variants ? 
    product.variants.map(variant => ({
      name: variant.color || variant.name || 'Standard',
      hex: variant.hex || getDefaultColor(variant.color),
      variantId: variant.id,
      images: variant.images || [],
      price: variant.price || currentPrice,
      stock: variant.stock || product.stock || 0
    })).filter((color, index, arr) => arr.findIndex(c => c.name === color.name) === index) : 
    [
      { name: 'Space Grey', hex: '#3D3D3D' },
      { name: 'Navy Blue', hex: '#1E3A8A' },
      { name: 'Rose Gold', hex: '#F59E0B' },
      { name: 'Forest Green', hex: '#1A5C2A' },
      { name: 'Maroon', hex: '#7B1C1C' },
      { name: 'Light Grey', hex: '#9CA3AF' },
      { name: 'Burgundy', hex: '#8B0000' },
      { name: 'Midnight Black', hex: '#000000' }
    ];

  // Helper function to get default hex color for color names
  const getDefaultColor = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'brown': '#8B4513',
      'pink': '#FFC0CB',
      'purple': '#800080',
      'orange': '#FFA500',
      'grey': '#808080',
      'gray': '#808080'
    };
    return colorMap[colorName?.toLowerCase()] || '#666666';
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    console.log('Selected color:', color.name, color.hex);
    
    // Update images when color changes
    if (onColorChange && color.images && color.images.length > 0) {
      onColorChange(color.images);
    } else if (onColorChange) {
      // Fallback to default images if no color-specific images
      onColorChange(images);
    }
  };

  const features = [
    { icon: Truck, text: 'Free Shipping' },
    { icon: Shield, text: 'Secure Payment' },
    { icon: RotateCcw, text: '30-Day Returns' },
    { icon: Package, text: 'Premium Quality' },
    { icon: Clock, text: 'Fast Delivery' },
    { icon: Award, text: 'Warranty Included' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title and Price */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{displayName}</h1>
        
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3 mb-3 sm:mb-4">
          <span className="text-2xl sm:text-3xl font-bold text-primary-600">
            ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}
          </span>
          {oldPrice && oldPrice > currentPrice && (
            <span className="text-lg sm:text-xl text-gray-500 line-through">
              ${typeof oldPrice === 'number' ? oldPrice.toFixed(2) : oldPrice}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-6">
          <div className="flex items-center mb-2 sm:mb-0">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i < Math.floor(product.rating || 0) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating || 0}.0 ({product.reviews || 0} reviews)
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Color</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {availableColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorSelect(color)}
                className={`relative group transition-all duration-200 ${
                  selectedColor?.hex === color.hex 
                    ? 'scale-110' 
                    : 'hover:scale-105'
                }`}
                title={color.name}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${
                    selectedColor?.hex === color.hex
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                {selectedColor?.hex === color.hex && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedColor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Selected:</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="font-medium text-gray-900">{selectedColor.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add to Cart
          </button>
          
          <button
            onClick={handleShare}
            className="p-2.5 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Why Choose Us?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 sm:space-x-3">
              <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-600">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Availability:</span>
          <span className={`text-sm font-medium ${
            (product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {(product.stock || 0) > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
