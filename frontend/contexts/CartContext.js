import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error('useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isMounted = useRef(true);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    try {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: quantity,
        image: product.image,
        category: product.category,
        variant: product.variant || 'Standard',
        inStock: product.inStock !== false
      };
      
      setCartItems(prev => {
        // Check if item already exists
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          // Update quantity if item exists
          const newItems = prev.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return newItems;
        } else {
          // Add new item
          const newItems = [...prev, newItem];
          return newItems;
        }
      });

      // Open cart drawer when item is added
      setIsCartOpen(true);
    } catch (error) {
      console.error('CartContext - Error in addToCart:', error);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  // Remove item from cart
  const removeItem = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    if (isMounted.current) {
      setCartItems([]);
    }
  }, []);

  // Calculate cart totals
  const calculateSubtotal = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      const itemPrice = item.originalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  const calculateTotalItems = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Open/close cart drawer
  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);
  
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Mock cross-sell products
  const crossSellProducts = [
    {
      id: 101,
      name: 'Industrial Sensor Kit',
      price: 2500,
      image: '/images/products/sensor-kit.jpg',
      category: 'Sensors'
    },
    {
      id: 102,
      name: 'Control Panel Pro',
      price: 3200,
      image: '/images/products/control-panel.jpg',
      category: 'Control Systems'
    }
  ];

  const value = {
    cartItems: cartItems || [],
    isCartOpen: isCartOpen || false,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    calculateSubtotal,
    calculateTotalItems,
    openCart,
    closeCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
