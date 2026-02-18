import React, { useState } from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const QuickAddToCart = ({ product, className = '', size = 'md' }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || isAdded) return;
    
    setIsLoading(true);
    
    try {
      await addToCart(product, 1);
      setIsAdded(true);
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className={`
        ${sizeClasses[size]} 
        rounded-lg 
        font-medium 
        transition-all 
        duration-200 
        flex 
        items-center 
        justify-center 
        space-x-2
        ${isAdded 
          ? 'bg-green-600 text-white hover:bg-green-700' 
          : 'bg-black text-white hover:bg-gray-800'
        }
        ${isLoading || isAdded ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={isAdded ? 'Added to cart' : 'Add to cart'}
    >
      {isLoading ? (
        <>
          <div className={`${iconSizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`} />
          <span>Adding...</span>
        </>
      ) : isAdded ? (
        <>
          <Check className={iconSizes[size]} />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className={iconSizes[size]} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default QuickAddToCart;
