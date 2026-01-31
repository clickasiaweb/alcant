import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';

const WishlistButton = ({ product, className = '', size = 'md' }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('WishlistButton - Clicked', { productId: product.id, productName: product.name });
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('WishlistButton - Calling toggleWishlist');
      const result = toggleWishlist(product);
      console.log('WishlistButton - toggleWishlist result:', result);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-full px-6 py-3',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]} 
        ${size === 'lg' ? 'rounded-full' : 'rounded-lg'}
        flex 
        items-center 
        justify-center 
        transition-all 
        duration-200 
        ${size === 'md' ? 'font-medium' : ''}
        ${isWishlisted 
          ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' 
          : 'bg-white text-gray-400 border-gray-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
        }
        border 
        ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <div className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
      ) : (
        <Heart 
          className={`${iconSizes[size]} ${isWishlisted ? 'fill-current' : ''}`} 
        />
      )}
    </button>
  );
};

export default WishlistButton;
