import React from 'react';
import WishlistButton from '../WishlistButton';

const ProductImage = ({ product, displayName, mainImage, selectedImage, images, hasMultipleImages, handleImageChange }) => {
  const getImageUrl = (image) => {
    if (!image) {
      return `https://picsum.photos/seed/${product?.name || 'product'}/600/600.jpg`;
    }
    
    // Handle Google Drive URLs - use proxy to avoid CORS issues
    if (image.includes('drive.google.com')) {
      // Extract file ID from Google Drive URL
      const match = image.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) {
        const fileId = match[1];
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/proxy/drive/${fileId}`;
      }
      // Fallback to generic proxy
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/proxy/image?imageUrl=${encodeURIComponent(image)}`;
    }
    
    // Handle full URLs (including Supabase storage URLs) - return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Handle blob URLs (for admin panel preview)
    if (image.startsWith('blob:')) {
      return image;
    }
    
    // Handle data URLs (base64 images)
    if (image.startsWith('data:')) {
      return image;
    }
    
    // Handle test/placeholder images
    if (image.includes('test-image') || image.includes('placeholder')) {
      return `https://picsum.photos/seed/${product.name}/600/600.jpg`;
    }
    
    // Handle relative paths that start with /uploads/ (legacy local storage)
    if (image.startsWith('/uploads/')) {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${image}`;
    }
    
    // Default fallback - assume it's a filename and construct Supabase URL
    // This handles cases where image is just a filename like "product-123.jpg"
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && image) {
      return `${supabaseUrl}/storage/v1/object/public/products/${image}`;
    }
    
    // Final fallback
    return `https://picsum.photos/seed/${product.name}/600/600.jpg`;
  };

  const currentPrice = product.price || product.final_price || 0;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-square cursor-zoom-in">
          <img
            src={getImageUrl(mainImage)}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${displayName}/600/600.jpg`;
            }}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {(product.is_new || product.isNew) && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              NEW
            </span>
          )}
          {(product.is_limited_edition || product.isLimitedEdition) && (
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              LIMITED
            </span>
          )}
          {(product.is_blue_monday_sale || product.isBlueMondaySale) && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              SALE {product.old_price && product.old_price > currentPrice ? 
                Math.round(((product.old_price - currentPrice) / product.old_price) * 100) : 0}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <WishlistButton 
            product={{
              id: product.id,
              name: displayName,
              slug: product.slug,
              price: currentPrice,
              image: mainImage
            }}
            size="lg"
          />
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-primary-600 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${displayName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${displayName}/300/300.jpg`;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
