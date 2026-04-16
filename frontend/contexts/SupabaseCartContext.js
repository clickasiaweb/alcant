import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const hasMergedCart = useRef(false);

  // Helper function to fix cart item prices and names
  const fixCartItemPrices = useCallback((cartItems) => {
    return cartItems.map(item => ({
      ...item,
      // Ensure name is valid
      name: item.name || item.displayName || `Product ${item.id || item.product_id || 'Unknown'}`,
      // Ensure price is a number with fallback
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      originalPrice: typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice) || parseFloat(item.old_price) || parseFloat(item.price) || 0
    }));
  }, []);

  // Load local cart from localStorage on mount
  useEffect(() => {
    const savedLocalCart = localStorage.getItem('localCart');
    if (savedLocalCart) {
      try {
        const parsedCart = JSON.parse(savedLocalCart);
        console.log('Loading local cart from localStorage:', parsedCart);
        console.log('Local cart items with prices and names before fix:', parsedCart.map(item => ({
          name: item.name,
          displayName: item.displayName,
          id: item.id,
          product_id: item.product_id,
          price: item.price,
          originalPrice: item.originalPrice
        })));
        
        // Apply price fixing to loaded cart
        const fixedCart = fixCartItemPrices(parsedCart);
        console.log('Local cart items with prices and names after fix:', fixedCart.map(item => ({
          name: item.name,
          displayName: item.displayName,
          id: item.id,
          product_id: item.product_id,
          price: item.price,
          originalPrice: item.originalPrice
        })));
        
        setLocalCart(fixedCart);
      } catch (error) {
        console.error('Error parsing local cart:', error);
        localStorage.removeItem('localCart');
      }
    }
  }, []); // Remove fixCartItemPrices dependency to avoid circular dependency

  // Save local cart to localStorage whenever it changes
  useEffect(() => {
    if (localCart.length > 0) {
      localStorage.setItem('localCart', JSON.stringify(localCart));
    } else {
      localStorage.removeItem('localCart');
    }
  }, [localCart]);

  // Sync cartItems with localCart for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated()) {
      const fixedCartItems = fixCartItemPrices(localCart);
      console.log('Fixed cart items prices and names:', fixedCartItems.map(item => ({
        name: item.name,
        displayName: item.displayName,
        id: item.id,
        product_id: item.product_id,
        price: item.price,
        originalPrice: item.originalPrice
      })));
      setCartItems(fixedCartItems);
    }
  }, [localCart, isAuthenticated]); // Remove fixCartItemPrices dependency

  // Load cart from database when user is authenticated
  useEffect(() => {
    const loadAndMergeCart = async () => {
      if (user) {
        // Reset merge flag when user changes
        hasMergedCart.current = false;
        
        // Try to load from database
        await loadCartFromDatabase();
        
        // If there are local cart items and haven't merged yet, merge them with database
        if (localCart.length > 0 && !hasMergedCart.current) {
          console.log('Merging local cart with database cart');
          hasMergedCart.current = true;
          await mergeCartOnLogin();
        }
      } else {
        // Use local cart when not authenticated
        console.log('Using local cart for unauthenticated user');
        setCartItems(localCart);
      }
    };
    
    loadAndMergeCart();
  }, [user]);

  // Load cart from database
  const loadCartFromDatabase = async () => {
    if (!user) {
      console.log('No user provided, skipping database cart load');
      return;
    }

    setLoading(true);
    try {
      console.log('Loading cart from database for user:', user.id);
      const items = await cartService.getCartItems(user.id);
      setCartItems(items);
      console.log('Cart loaded from database successfully:', items.length, 'items');
    } catch (error) {
      console.error('Error loading cart from database:', error);
      console.error('Error details:', error.message);
      // Fallback to local cart on error
      console.log('Falling back to local cart with', localCart.length, 'items');
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
      console.log('🛒 SupabaseCartContext - addToCart called:', {
        product: product.name,
        productId: product.id,
        quantity,
        options,
        isAuthenticated: isAuthenticated(),
        user: user?.email
      });

      if (isAuthenticated() && user) {
        console.log('👤 User authenticated, adding to database cart...');
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
        
        console.log('✅ Cart item added to database:', cartItem);
        
        // Reload cart from database
        await loadCartFromDatabase();
        
        // Open cart drawer when item is added
        setIsCartOpen(true);
        
        return cartItem;
      } else {
        console.log('🔓 User not authenticated, adding to local cart...');
        // Add to local cart
        const newItem = {
          id: product.id,
          name: product.name || product.displayName || product.title || `Product ${product.id}`,
          displayName: product.displayName || product.name || product.title || `Product ${product.id}`,
          price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
          originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice) || parseFloat(product.old_price) || parseFloat(product.price) || 0,
          quantity: quantity,
          image: product.image || (product.images && product.images[0]),
          category: product.category,
          variant: options.selected_color || product.variant || 'Standard',
          selected_color: options.selected_color || product.variant,
          selected_size: options.selected_size,
          inStock: product.inStock !== false,
          product_id: product.id
        };
        
        console.log('New cart item with prices and name:', {
          name: newItem.name,
          price: newItem.price,
          originalPrice: newItem.originalPrice,
          productData: {
            originalName: product.name,
            displayName: product.displayName,
            id: product.id
          }
        });
        
        setLocalCart(prev => {
          // Check if item already exists
          const existingItemIndex = prev.findIndex(item => 
            item.id === product.id && 
            item.selected_color === newItem.selected_color &&
            item.selected_size === newItem.selected_size
          );
          
          let updatedCart;
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const newCart = [...prev];
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + quantity
            };
            updatedCart = newCart;
          } else {
            // Add new item
            updatedCart = [...prev, newItem];
          }
          
          // Update cartItems state for non-authenticated users
          if (!isAuthenticated()) {
            setCartItems(updatedCart);
          }
          
          return updatedCart;
        });
        
        // Open cart drawer when item is added
        setIsCartOpen(true);
        
        return newItem;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

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
        setLocalCart(prev => {
          const updatedCart = prev.map(item =>
            (item.id === itemId || item.product_id === itemId) 
              ? { ...item, quantity: newQuantity }
              : item
          );
          
          // Update cartItems state for non-authenticated users
          if (!isAuthenticated()) {
            setCartItems(updatedCart);
          }
          
          return updatedCart;
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      if (isAuthenticated() && user) {
        // Remove from database
        await cartService.removeFromCart(itemId);
        await loadCartFromDatabase();
      } else {
        // Remove from local cart
        setLocalCart(prev => {
          const updatedCart = prev.filter(item => 
            item.id !== itemId && item.product_id !== itemId
          );
          
          // Update cartItems state for non-authenticated users
          if (!isAuthenticated()) {
            setCartItems(updatedCart);
          }
          
          return updatedCart;
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

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
        // Update cartItems state for non-authenticated users
        if (!isAuthenticated()) {
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, [user, isAuthenticated]);

  // Calculate cart totals
  const calculateSubtotal = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    console.log('Calculating subtotal with cart items:', cartItems.map(item => ({
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity
    })));
    
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.originalPrice) || parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
      console.log(`Item ${item.name}: price=${itemPrice}, quantity=${itemQuantity}, subtotal=${itemPrice * itemQuantity}`);
      return total + (itemPrice * itemQuantity);
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
