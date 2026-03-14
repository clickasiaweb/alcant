import axios from 'axios';

const API_BASE_URL = "https://alcant-backend.vercel.app/api"; // FIXED - Using hardcoded URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Add request interceptor for cache-busting
api.interceptors.request.use((config) => {
  // Add timestamp to prevent caching
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  return config;
});

// Products API
export const productsAPI = {
  // Get all products
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get products by category with optional filters
  getByCategory: async (category, options = {}) => {
    const params = new URLSearchParams();
    
    if (options.subcategory) params.append('subcategory', options.subcategory);
    if (options.sort) params.append('sort', options.sort);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);

    const url = params.toString() 
      ? `/categories/${category}/products?${params}`
      : `/categories/${category}/products`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get product by slug
  getBySlug: async (slug) => {
    console.log('API: Fetching product with slug:', slug);
    console.log('API: Base URL:', api.defaults.baseURL);
    console.log('API: Full URL:', `${api.defaults.baseURL}/products/slug/${slug}`);
    console.log('API: Hardcoded check - should be https://alcant-backend.vercel.app/api');
    
    try {
      console.log('API: Making request...');
      const response = await api.get(`/products/slug/${slug}`);
      console.log('API: Request completed successfully');
      console.log('API: Response received:', response.data);
      console.log('API: Response status:', response.status);
      console.log('API: Response headers:', response.headers);
      console.log('API: Response type:', typeof response.data);
      console.log('API: Response keys:', Object.keys(response.data || {}));
      return response.data;
    } catch (error) {
      console.error('API: ERROR - Request failed!');
      console.error('API: Error fetching product by slug:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      console.error('API: Error message:', error.message);
      console.error('API: Full error:', error);
      
      // Return empty object on error to prevent undefined
      return {};
    }
  },

  // Get featured products
  getFeatured: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Get new products
  getNew: async () => {
    const response = await api.get('/products/new');
    return response.data;
  },

  // Get sale products
  getSale: async () => {
    const response = await api.get('/products/sale');
    return response.data;
  },

  // Get limited edition products
  getLimitedEdition: async () => {
    const response = await api.get('/products/limited-edition');
    return response.data;
  },

  // Search products
  search: async (query) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get categories with counts
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get subcategories for a category
  getSubcategories: async (categorySlug) => {
    try {
      const response = await api.get(`/categories/${categorySlug}/subcategories`);
      return response.data.subcategories || [];
    } catch (error) {
      console.warn(`Subcategories endpoint not found for ${categorySlug}, using fallback`);
      // Return null to indicate API endpoint doesn't exist
      return null;
    }
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

export default api;
