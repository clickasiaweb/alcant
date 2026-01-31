import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
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
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
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
