import React, { createContext, useContext, useState } from 'react';

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

  console.log('CartProvider - Rendering with cartItems:', cartItems.length);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    console.log('CartContext - addToCart called with:', product, quantity);
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
        const newItems = [...prev, newItem];
        console.log('CartContext - New cart items:', newItems);
        return newItems;
      });

      // Open cart drawer when item is added
      console.log('CartContext - Opening cart drawer');
      setIsCartOpen(true);
    } catch (error) {
      console.error('CartContext - Error in addToCart:', error);
    }
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.originalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Open/close cart drawer
  const openCart = () => {
    console.log('CartContext - openCart called');
    setIsCartOpen(true);
  };
  
  const closeCart = () => {
    console.log('CartContext - closeCart called');
    setIsCartOpen(false);
  };

  // Mock cross-sell products
  const crossSellProducts = [
    {
      id: 101,
      name: 'Industrial Sensor Kit',
      price: 2500,
      image: 'https://via.placeholder.com/60x60/1a365d/ffffff?text=Sensor',
      category: 'Sensors'
    },
    {
      id: 102,
      name: 'Control Panel Pro',
      price: 3200,
      image: 'https://via.placeholder.com/60x60/2b6cb0/ffffff?text=Panel',
      category: 'Control Systems'
    }
  ];

  const value = {
    cartItems,
    isCartOpen,
    crossSellProducts,
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

  console.log('CartProvider - Providing value:', { cartItems: cartItems.length, isCartOpen });

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
