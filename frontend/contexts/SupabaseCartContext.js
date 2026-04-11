import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { cartService } from '../lib/supabaseCartService';

const SupabaseCartContext = createContext();

export const useSupabaseCart = () => {
  const context = useContext(SupabaseCartContext);
  if (!context) {
    throw new Error('useSupabaseCart must be used within a SupabaseCartProvider');
  }
  return context;
};

export const SupabaseCartProvider = ({ children }) => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCart, setLocalCart] = useState([]);

  // Load local cart from localStorage on mount
  useEffect(() => {
    const savedLocalCart = localStorage.getItem('localCart');
    if (savedLocalCart) {
      try {
        setLocalCart(JSON.parse(savedLocalCart));
      } catch (error) {
        console.error('Error parsing local cart:', error);
        localStorage.removeItem('localCart');
      }
    }
  }, []);

  // Save local cart to localStorage whenever it changes
  useEffect(() => {
    if (localCart.length > 0) {
      localStorage.setItem('localCart', JSON.stringify(localCart));
    } else {
      localStorage.removeItem('localCart');
    }
  }, [localCart]);

  // Load cart from database when user is authenticated
  useEffect(() => {
    if (user) {
      // Try to load from database but fallback to local cart
      loadCartFromDatabase();
    } else {
      // Use local cart when not authenticated
      console.log('Using local cart for unauthenticated user');
      setCartItems(localCart);
    }
  }, [user, localCart]);

  // Load cart from database
  const loadCartFromDatabase = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const items = await cartService.getCartItems(user.id);
      setCartItems(items);
      console.log('Cart loaded from database:', items.length, 'items');
    } catch (error) {
      console.error('Error loading cart from database:', error);
      // Fallback to local cart on error
      console.log('Falling back to local cart');
      setCartItems(localCart);
    } finally {
      setLoading(false);
    }
  };

  // Merge local cart with database cart on login
  const mergeCartOnLogin = async () => {
    if (!user || localCart.length === 0) return;

    setLoading(true);
    try {
      const mergeResults = await cartService.mergeCarts(user.id, localCart);
      console.log('Cart merge results:', mergeResults);
      
      // Clear local cart after successful merge
      setLocalCart([]);
      localStorage.removeItem('localCart');
      
      // Reload cart from database
      await loadCartFromDatabase();
      
      return mergeResults;
    } catch (error) {
      console.error('Error merging cart on login:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1, options = {}) => {
    try {
      if (isAuthenticated() && user) {
        // Add to database cart
        const cartItem = await cartService.addToCart(
          user.id,
          product.id,
          quantity,
          {
            selected_color: options.selected_color || product.variant,
            selected_size: options.selected_size
          }
        );
        
        // Reload cart from database
        await loadCartFromDatabase();
        
        return cartItem;
      } else {
        // Add to local cart
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.old_price,
          quantity: quantity,
          image: product.image || (product.images && product.images[0]),
          category: product.category,
          variant: options.selected_color || product.variant || 'Standard',
          selected_color: options.selected_color || product.variant,
          selected_size: options.selected_size,
          inStock: product.inStock !== false,
          product_id: product.id
        };
        
        setLocalCart(prev => {
          // Check if item already exists
          const existingItemIndex = prev.findIndex(item => 
            item.id === product.id && 
            item.selected_color === newItem.selected_color &&
            item.selected_size === newItem.selected_size
          );
          
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const newCart = [...prev];
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + quantity
            };
            return newCart;
          } else {
            // Add new item
            return [...prev, newItem];
          }
        });
        
        return newItem;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, [user]);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (isAuthenticated() && user) {
        // Update in database
        await cartService.updateQuantity(itemId, newQuantity);
        await loadCartFromDatabase();
      } else {
        // Update in local cart
        setLocalCart(prev =>
          prev.map(item =>
            (item.id === itemId || item.product_id === itemId) 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }, [user]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      if (isAuthenticated() && user) {
        // Remove from database
        await cartService.removeFromCart(itemId);
        await loadCartFromDatabase();
      } else {
        // Remove from local cart
        setLocalCart(prev => prev.filter(item => 
          item.id !== itemId && item.product_id !== itemId
        ));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }, [user]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated() && user) {
        // Clear from database
        await cartService.clearCart(user.id);
        setCartItems([]);
      } else {
        // Clear local cart
        setLocalCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, [user]);

  // Calculate cart totals
  const calculateSubtotal = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const itemPrice = item.products?.old_price || item.originalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  const calculateTotalItems = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Get cart summary
  const getCartSummary = useCallback(async () => {
    if (isAuthenticated() && user) {
      try {
        return await cartService.getCartSummary(user.id);
      } catch (error) {
        console.error('Error getting cart summary:', error);
      }
    }
    
    // Return local cart summary
    return {
      totalItems: calculateTotalItems(),
      subtotal: calculateSubtotal(),
      totalDiscount: 0
    };
  }, [user, calculateTotalItems, calculateSubtotal]);

  // Cart drawer controls
  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Auto-merge cart when user logs in
  useEffect(() => {
    if (user && localCart.length > 0) {
      mergeCartOnLogin();
    }
  }, [user, localCart.length]);

  const value = {
    // State
    cartItems,
    isCartOpen,
    loading,
    
    // Cart methods
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    loadCartFromDatabase,
    mergeCartOnLogin,
    
    // Calculations
    calculateSubtotal,
    calculateTotalItems,
    getCartSummary,
    
    // UI controls
    openCart,
    closeCart,
    setIsCartOpen,
    
    // Local cart access
    localCart
  };

  return (
    <SupabaseCartContext.Provider value={value}>
      {children}
    </SupabaseCartContext.Provider>
  );
};
