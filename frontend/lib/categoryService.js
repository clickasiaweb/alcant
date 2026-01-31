import apiClient from './api';

export const categoryService = {
  // Get all active categories for navigation
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get single category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Get subcategories for a category
  getSubcategories: async (categorySlug) => {
    try {
      const response = await apiClient.get(`/categories/${categorySlug}/subcategories`);
      return response.data.subcategories || [];
    } catch (error) {
      console.warn(`Subcategories endpoint not found for ${categorySlug}, using fallback`);
      // Return empty array if subcategories endpoint doesn't exist
      // The component will handle adding mock data
      return null; // Return null to indicate API endpoint doesn't exist
    }
  },

  // Get products for a category
  getCategoryProducts: async (slug, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.sort) params.append('sort', options.sort);
      if (options.subcategory) params.append('subcategory', options.subcategory);

      const response = await apiClient.get(`/categories/${slug}/products?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category products:', error);
      throw error;
    }
  }
};
