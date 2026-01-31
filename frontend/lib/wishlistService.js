// Wishlist service for handling wishlist functionality
const wishlistService = {
  // Get wishlist from localStorage
  getWishlist: () => {
    if (typeof window === 'undefined') return [];
    
    try {
      const wishlist = localStorage.getItem('wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch {
      return [];
    }
  },

  // Add item to wishlist
  addToWishlist: (product) => {
    if (typeof window === 'undefined') return false;
    
    try {
      const wishlist = wishlistService.getWishlist();
      const existingItem = wishlist.find(item => item.id === product.id);
      
      if (existingItem) {
        return false; // Already in wishlist
      }

      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        variant: product.variant || 'Standard',
        slug: product.slug,
        addedAt: new Date().toISOString()
      };

      const updatedWishlist = [...wishlist, wishlistItem];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      return true;
    } catch {
      return false;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: (productId) => {
    if (typeof window === 'undefined') return false;
    
    try {
      const wishlist = wishlistService.getWishlist();
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      return true;
    } catch {
      return false;
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId) => {
    if (typeof window === 'undefined') return false;
    
    try {
      const wishlist = wishlistService.getWishlist();
      return wishlist.some(item => item.id === productId);
    } catch {
      return false;
    }
  },

  // Toggle item in wishlist
  toggleWishlist: (product) => {
    console.log('wishlistService - toggleWishlist called', product);
    if (wishlistService.isInWishlist(product.id)) {
      console.log('wishlistService - Removing from wishlist');
      wishlistService.removeFromWishlist(product.id);
      return false; // Removed
    } else {
      console.log('wishlistService - Adding to wishlist');
      wishlistService.addToWishlist(product);
      return true; // Added
    }
  },

  // Clear entire wishlist
  clearWishlist: () => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem('wishlist');
      return true;
    } catch {
      return false;
    }
  },

  // Get wishlist count
  getWishlistCount: () => {
    return wishlistService.getWishlist().length;
  },

  // Move item from wishlist to cart
  moveToCart: (productId, addToCartFunction) => {
    const wishlist = wishlistService.getWishlist();
    const item = wishlist.find(item => item.id === productId);
    
    if (item && addToCartFunction) {
      addToCartFunction(item, 1);
      wishlistService.removeFromWishlist(productId);
      return true;
    }
    
    return false;
  },

  // Get wishlist total
  getWishlistTotal: () => {
    const wishlist = wishlistService.getWishlist();
    return wishlist.reduce((total, item) => {
      const itemPrice = item.originalPrice || item.price;
      return total + itemPrice;
    }, 0);
  }
};

export default wishlistService;
