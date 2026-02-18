// Search service for handling product search functionality
const searchService = {
  // Mock product data - in real app this would come from API
  mockProducts: [
    {
      id: 1,
      name: 'Premium Phone Case',
      category: 'Phone Cases',
      price: 39.99,
      image: 'https://picsum.photos/seed/phone-case-1/60/60.jpg',
      slug: 'premium-phone-case'
    },
    {
      id: 2,
      name: 'Leather Wallet',
      category: 'Wallets',
      price: 59.99,
      image: 'https://picsum.photos/seed/wallet-1/60/60.jpg',
      slug: 'leather-wallet'
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      category: 'Accessories',
      price: 129.99,
      image: 'https://picsum.photos/seed/headphones-1/60/60.jpg',
      slug: 'wireless-headphones'
    },
    {
      id: 4,
      name: 'Smart Watch',
      category: 'Accessories',
      price: 299.99,
      image: 'https://picsum.photos/seed/watch-1/60/60.jpg',
      slug: 'smart-watch'
    },
    {
      id: 5,
      name: 'Laptop Stand',
      category: 'Accessories',
      price: 49.99,
      image: 'https://picsum.photos/seed/stand-1/60/60.jpg',
      slug: 'laptop-stand'
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      category: 'Accessories',
      price: 79.99,
      image: 'https://picsum.photos/seed/speaker-1/60/60.jpg',
      slug: 'bluetooth-speaker'
    },
    {
      id: 7,
      name: 'Phone Charger',
      category: 'Accessories',
      price: 29.99,
      image: 'https://picsum.photos/seed/charger-1/60/60.jpg',
      slug: 'phone-charger'
    },
    {
      id: 8,
      name: 'Tablet Case',
      category: 'Phone Cases',
      price: 44.99,
      image: 'https://picsum.photos/seed/tablet-case-1/60/60.jpg',
      slug: 'tablet-case'
    }
  ],

  // Search products with debouncing
  searchProducts: async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    
    return this.mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 results
  },

  // Get popular suggestions
  getPopularSuggestions: () => {
    return [
      'Phone cases',
      'Wireless headphones',
      'Leather wallets',
      'Smart watches',
      'Bluetooth speakers'
    ];
  },

  // Get recent searches (from localStorage)
  getRecentSearches: () => {
    if (typeof window === 'undefined') return [];
    
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  },

  // Save search to recent searches
  saveRecentSearch: (query) => {
    if (typeof window === 'undefined' || !query || query.trim().length < 2) return;
    
    try {
      const recent = searchService.getRecentSearches();
      const updated = [query, ...recent.filter(item => item !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  },

  // Clear recent searches
  clearRecentSearches: () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('recentSearches');
    } catch {
      // Silently fail
    }
  }
};

export default searchService;
