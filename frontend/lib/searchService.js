// Search service for handling product search functionality
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://alcant-backend.vercel.app/api' 
  : 'http://localhost:5001/api';

const searchService = {
  // Search products using real API
  searchProducts: async (query) => {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query.trim())}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform product data to match expected format
      return (data.products || []).map(product => ({
        id: product.id || product._id,
        name: product.name,
        category: product.category || 'Unknown',
        price: product.price || product.final_price || 0,
        image: product.image || product.images?.[0] || 'https://picsum.photos/seed/product/60/60.jpg',
        slug: product.slug,
        description: product.description,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        isNew: product.is_new || false,
        discount: product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0
      }));
    } catch (error) {
      console.error('Search service error:', error);
      // Return empty array on error to prevent UI crashes
      return [];
    }
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
