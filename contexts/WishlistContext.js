import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import wishlistService from '../lib/wishlistService';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    console.error('useWishlist must be used within a WishlistProvider');
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize wishlist on client side
  useEffect(() => {
    setIsClient(true);
    setWishlistItems(wishlistService.getWishlist());
  }, []);

  // Open wishlist dropdown
  const openWishlist = useCallback(() => {
    setIsWishlistOpen(true);
    // Refresh wishlist items
    setWishlistItems(wishlistService.getWishlist());
  }, []);

  // Close wishlist dropdown
  const closeWishlist = useCallback(() => {
    setIsWishlistOpen(false);
  }, []);

  // Add item to wishlist
  const addToWishlist = useCallback((product) => {
    const success = wishlistService.addToWishlist(product);
    if (success) {
      setWishlistItems(wishlistService.getWishlist());
    }
    return success;
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId) => {
    const success = wishlistService.removeFromWishlist(productId);
    if (success) {
      setWishlistItems(wishlistService.getWishlist());
    }
    return success;
  }, []);

  // Toggle item in wishlist
  const toggleWishlist = useCallback((product) => {
    console.log('WishlistContext - toggleWishlist called', product);
    const isAdded = wishlistService.toggleWishlist(product);
    console.log('WishlistContext - service toggleWishlist result:', isAdded);
    setWishlistItems(wishlistService.getWishlist());
    console.log('WishlistContext - updated wishlistItems:', wishlistService.getWishlist());
    return isAdded;
  }, []);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistService.isInWishlist(productId);
  }, []);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    const success = wishlistService.clearWishlist();
    if (success) {
      setWishlistItems([]);
    }
    return success;
  }, []);

  // Move item to cart
  const moveToCart = useCallback((productId, addToCartFunction) => {
    const success = wishlistService.moveToCart(productId, addToCartFunction);
    if (success) {
      setWishlistItems(wishlistService.getWishlist());
    }
    return success;
  }, []);

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlistService.getWishlistCount();
  }, []);

  // Get wishlist total
  const getWishlistTotal = useCallback(() => {
    return wishlistService.getWishlistTotal();
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };

    if (isWishlistOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen, closeWishlist]);

  const value = {
    wishlistItems,
    isWishlistOpen,
    isClient,
    openWishlist,
    closeWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    getWishlistCount,
    getWishlistTotal
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
