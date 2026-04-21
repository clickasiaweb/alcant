import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { cartService } from '../lib/supabaseCartService';
import { supabase } from '../lib/supabase';

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

  // Helper function to map cart items with product details
  const mapCartItemsWithProducts = useCallback((cartItems, products) => {
    return cartItems.map(item => {
      const product = products?.find(p => p.id === (item.product_id || item.id));
      
      if (!product) {
        // If no product found, return basic item with better defaults
        return {
          ...item,
          name: 'Unknown Product',
          price: 0,
          originalPrice: 0,
          image: 'https://via.placeholder.com/80x80/1a365d/ffffff?text=Product'
        };
      }
      
      // Handle images
      let productImages = [];
      if (product.images) {
        if (typeof product.images === 'string') {
          try {
            productImages = JSON.parse(product.images);
          } catch (e) {
            productImages = [product.images];
          }
        } else if (Array.isArray(product.images)) {
          productImages = product.images;
        }
      }
      
      const firstImage = productImages.length > 0 
        ? (typeof productImages[0] === 'string' ? productImages[0] : productImages[0]?.url)
        : 'https://via.placeholder.com/80x80/1a365d/ffffff?text=Product';
      
      return {
        ...item,
        name: product.name || 'Unknown Product',
        displayName: product.name || 'Unknown Product',
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
        originalPrice: typeof product.old_price === 'number' ? product.old_price : parseFloat(product.old_price) || parseFloat(product.price) || 0,
        image: firstImage,
        images: productImages,
        category: product.category || 'Unknown'
      };
    });
  }, []);

  // Helper function to fetch product details and fix cart items
  const fetchProductDetailsForCart = useCallback(async (cartItems) => {
    if (!cartItems || cartItems.length === 0) return [];
    
    try {
      // Get product IDs from cart items
      const productIds = cartItems.map(item => item.product_id || item.id).filter(Boolean);
      
      if (productIds.length === 0) return cartItems;
      
      // Fetch product details from database
      console.log('Fetching products for IDs:', productIds);
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, price, old_price, images, category')
        .in('id', productIds);
      
      console.log('Product query result:', { data: products, error });
      
      if (error) {
        console.error('Error fetching product details:', error);
        // Fallback: try to fetch products one by one
        const fallbackProducts = [];
        for (const productId of productIds) {
          try {
            const { data: singleProduct, error: singleError } = await supabase
              .from('products')
              .select('id, name, price, old_price, images, category')
              .eq('id', productId)
              .single();
            
            if (!singleError && singleProduct) {
              fallbackProducts.push(singleProduct);
            }
          } catch (e) {
            console.log(`Failed to fetch product ${productId}:`, e);
          }
        }
        
        if (fallbackProducts.length > 0) {
          console.log('Using fallback products:', fallbackProducts);
          return mapCartItemsWithProducts(cartItems, fallbackProducts);
        }
        
        return cartItems;
      }
      
      // Map cart items with product details
      return mapCartItemsWithProducts(cartItems, products);
    } catch (error) {
      console.error('Error in fetchProductDetailsForCart:', error);
      return cartItems;
    }
  }, [mapCartItemsWithProducts]);

  // Load local cart from localStorage on mount
  useEffect(() => {
    const loadLocalCart = () => {
      const savedLocalCart = localStorage.getItem('localCart');
      if (savedLocalCart) {
        try {
          const parsedCart = JSON.parse(savedLocalCart);
          // Use cart data directly since we store all product info
          setLocalCart(parsedCart);
        } catch (error) {
          console.error('Error parsing local cart:', error);
          localStorage.removeItem('localCart');
        }
      }
    };
    
    loadLocalCart();
  }, []);

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
      // Use local cart directly since we store all product info
      setCartItems(localCart);
      // console.log('Cart sync - Set cartItems to localCart:', localCart);
    }
  }, [localCart, isAuthenticated]);

  // Load cart from database when user is authenticated
  useEffect(() => {
    const loadAndMergeCart = async () => {
      if (user) {
        // console.log('Cart sync - User authenticated, loading from database');
        // Reset merge flag when user changes
        hasMergedCart.current = false;
        
        // Try to load from database
        await loadCartFromDatabase();
        
        // If there are local cart items and haven't merged yet, merge them with database
        if (localCart.length > 0 && !hasMergedCart.current) {
          hasMergedCart.current = true;
          await mergeCartOnLogin();
        }
      } else {
        // console.log('Cart sync - User not authenticated, using local cart');
        // Use local cart when not authenticated
        setCartItems(localCart);
      }
    };
    
    loadAndMergeCart();
  }, [user]);

  // Load cart from database
  const loadCartFromDatabase = async () => {
    if (!user) {
      // console.log('Cart sync - No user provided, skipping database cart load');
      return;
    }

    setLoading(true);
    try {
      // console.log('Cart sync - Loading cart from database for user:', user.id);
      const items = await cartService.getCartItems(user.id);
      // console.log('Cart sync - Loaded items from database:', items);
      setCartItems(items);
    } catch (error) {
      console.error('Cart sync - Error loading from database, using local cart:', error);
      // Fallback to local cart on error
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
      await cartService.mergeCarts(user.id, localCart);
      
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
      console.log('=== SupabaseCartContext addToCart ===');
      console.log('Product data:', product);
      console.log('Product ID:', product.id);
      console.log('Product name:', product.name);
      console.log('Product price:', product.price);
      console.log('User authenticated:', isAuthenticated());
      console.log('User ID:', user?.id);

      if (isAuthenticated() && user) {
        // Add to database cart with product data
        const cartItem = await cartService.addToCart(
          user.id,
          product.id,
          quantity,
          {
            selected_color: options.selected_color || product.variant,
            selected_size: options.selected_size
          },
          product // Pass complete product data
        );
        
        console.log('Cart item added to database:', cartItem);
        
        
        // Reload cart from database
        await loadCartFromDatabase();
        
        // Open cart drawer when item is added
        setIsCartOpen(true);
        
        return cartItem;
      } else {
        console.log('Adding to local cart (user not authenticated)');
        // Add to local cart - store all product data directly
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
          product_id: product.id,
          // Store all product data to avoid database fetches
          slug: product.slug,
          description: product.description,
          images: product.images
        };
        
        console.log('Local cart item created:', newItem);
        
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
    
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.originalPrice) || parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
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
