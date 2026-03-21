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
  handleShare 
}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  
  const discountPercentage = oldPrice && oldPrice > currentPrice ? 
    Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  // Available colors for this product
  const availableColors = [
    { name: 'Space Grey', hex: '#3D3D3D' },
    { name: 'Navy Blue', hex: '#1E3A8A' },
    { name: 'Rose Gold', hex: '#F59E0B' },
    { name: 'Forest Green', hex: '#1A5C2A' },
    { name: 'Maroon', hex: '#7B1C1C' },
    { name: 'Light Grey', hex: '#9CA3AF' },
    { name: 'Burgundy', hex: '#8B0000' },
    { name: 'Midnight Black', hex: '#000000' }
  ];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    console.log('Selected color:', color.name, color.hex);
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
    <div className="space-y-6">
      {/* Title and Price */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{displayName}</h1>
        
        <div className="flex items-baseline space-x-3 mb-4">
          <span className="text-3xl font-bold text-primary-600">
            ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}
          </span>
          {oldPrice && oldPrice > currentPrice && (
            <span className="text-xl text-gray-500 line-through">
              ${typeof oldPrice === 'number' ? oldPrice.toFixed(2) : oldPrice}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${
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
        <h3 className="text-lg font-semibold mb-3">Color</h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
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
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    selectedColor?.hex === color.hex
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                {selectedColor?.hex === color.hex && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
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
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="font-medium text-gray-900">{selectedColor.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
          
          <button
            onClick={handleShare}
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Why Choose Us?</h3>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <feature.icon className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-gray-600">{feature.text}</span>
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
