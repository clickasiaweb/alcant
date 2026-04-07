// Search service for handling product search functionality
const API_BASE_URL = 'https://alcant-backend.vercel.app/api';

// Category cache to avoid repeated API calls
let categoryCache = null;
let categoryCachePromise = null;
let categoryCacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch and cache categories
const getCategories = async () => {
  const now = Date.now();
  
  // Check if cache is expired
  if (categoryCache && (now - categoryCacheTimestamp) < CACHE_DURATION) {
    return categoryCache;
  }
  
  if (categoryCachePromise) return categoryCachePromise;
  
  categoryCachePromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      const categories = data.categories || [];
      
      // Create UUID to name mapping
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.name;
      });
      
      categoryCache = categoryMap;
      categoryCacheTimestamp = now;
      return categoryMap;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return {};
    }
  })();
  
  return categoryCachePromise;
};

// Force refresh categories cache
const refreshCategories = () => {
  categoryCache = null;
  categoryCachePromise = null;
  categoryCacheTimestamp = 0;
};

const searchService = {
  // Search products using real API
  searchProducts: async (query) => {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query.trim())}&limit=5`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Get category mapping
      const categoryMap = await getCategories();
      
      // Transform product data to match expected format
      const transformedResults = (data.products || []).map(product => {
        const categoryName = categoryMap[product.category] || 'Unknown';
        
        return {
          id: product.id || product._id,
          name: product.name,
          category: categoryName,
          price: product.price || product.final_price || 0,
          image: product.image || product.images?.[0] || 'https://picsum.photos/seed/product/60/60.jpg',
          slug: product.slug,
          description: product.description,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          isNew: product.is_new || false,
          discount: product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0
        };
      });
      
      return transformedResults;
    } catch (error) {
      console.error('Search service error:', error);
      // Return empty array on error to prevent UI crashes
      return [];
    }
  },

  // Get categories (exported for use in search page)
  getCategories: getCategories,

  // Get popular suggestions
  getPopularSuggestions: () => {
    return [
      'iPhone 17 Pro Case',
      'Leather Wallet',
      'Alcantara Pet Bed',
      'Premium Car Accessories',
      'Minimalist Wallet'
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
  },

  // Clear cache and refresh data
  clearCache: () => {
    refreshCategories();
  }
};

export default searchService;
