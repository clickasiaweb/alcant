import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  const isMounted = useRef(true);

  // Safe wishlist state update to prevent unnecessary re-renders
  const updateWishlistState = useCallback(() => {
    const newWishlist = wishlistService.getWishlist();
    setWishlistItems(prev => {
      // Prevent unnecessary re-render if data is same
      if (JSON.stringify(prev) === JSON.stringify(newWishlist)) {
        return prev;
      }
      return newWishlist;
    });
  }, []);

  // Cleanup effect
  useEffect(() => {
    console.log('WishlistContext - Cleanup useEffect mounted');
    return () => {
      console.log('WishlistContext - Cleanup useEffect cleanup');
      isMounted.current = false;
    };
  }, []);

  // Initialize wishlist on client side
  useEffect(() => {
    console.log('WishlistContext - Initialize useEffect mounted');
    setIsClient(true);
    updateWishlistState();
  }, []);

  // Open wishlist dropdown
  const openWishlist = useCallback(() => {
    if (isMounted.current) {
      setIsWishlistOpen(true);
      // Refresh wishlist items safely
      updateWishlistState();
    }
  }, []); // Remove updateWishlistState dependency to prevent circular dependency

  // Close wishlist dropdown
  const closeWishlist = useCallback(() => {
    if (isMounted.current) {
      setIsWishlistOpen(false);
    }
  }, []);

  // Add item to wishlist
  const addToWishlist = useCallback((product) => {
    const success = wishlistService.addToWishlist(product);
    if (success && isMounted.current) {
      updateWishlistState();
    }
    return success;
  }, []); // Remove updateWishlistState dependency

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId) => {
    const success = wishlistService.removeFromWishlist(productId);
    if (success && isMounted.current) {
      updateWishlistState();
    }
    return success;
  }, []); // Remove updateWishlistState dependency

  // Toggle item in wishlist
  const toggleWishlist = useCallback((product) => {
    const isAdded = wishlistService.toggleWishlist(product);
    if (isMounted.current) {
      updateWishlistState();
    }
    return isAdded;
  }, []); // Remove updateWishlistState dependency

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistService.isInWishlist(productId);
  }, []);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    const success = wishlistService.clearWishlist();
    if (success && isMounted.current) {
      setWishlistItems([]);
    }
    return success;
  }, []);

  // Move item to cart
  const moveToCart = useCallback((productId, addToCartFunction) => {
    const success = wishlistService.moveToCart(productId, addToCartFunction);
    if (success && isMounted.current) {
      updateWishlistState();
    }
    return success;
  }, []); // Remove updateWishlistState dependency

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  // Get wishlist total
  const getWishlistTotal = useCallback(() => {
    return wishlistItems.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }, [wishlistItems]);

  const value = useMemo(() => ({
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
  }), [wishlistItems, isWishlistOpen, isClient]); // ✅ ONLY STATE DEPENDENCIES

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
