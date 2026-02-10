import apiClient from './api';

export const productService = {
  // Get product by slug
  getProductBySlug: async (slug) => {
    try {
      console.log('Fetching product with slug:', slug);
      const response = await apiClient.get(`/products/slug/${slug}`);
      console.log('Product response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by slug:', slug, error);
      if (error.response?.status === 404) {
        throw new Error(`Product with slug "${slug}" not found`);
      }
      throw error;
    }
  },

  // Get products by subcategory
  getProductsBySubcategory: async (categorySlug, subcategorySlug, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit || 8); // Default 8 products for dropdown
      if (options.sort) params.append('sort', options.sort || 'featured');

      const response = await apiClient.get(`/products?category=${categorySlug}&subcategory=${subcategorySlug}&${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by subcategory:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categorySlug, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit || 8);
      if (options.sort) params.append('sort', options.sort || 'featured');

      const response = await apiClient.get(`/products/category/${categorySlug}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
};
