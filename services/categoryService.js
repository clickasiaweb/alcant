// API service for fetching categories and products
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

console.log('🔧 CategoryService initialized with API URL:', API_BASE_URL);

export const categoryService = {
  // Get all categories with subcategories and sub-subcategories
  async getCategoriesWithHierarchy() {
    try {
      const url = `${API_BASE_URL}/categories/hierarchy`;
      console.log('📡 CategoryService: Fetching categories from:', url);
      
      const response = await fetch(url);
      console.log('📊 CategoryService: Response status:', response.status);
      console.log('📊 CategoryService: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ CategoryService: Error response:', errorText);
        throw new Error(`Failed to fetch categories: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📁 CategoryService: Success! Data:', data);
      return data;
    } catch (error) {
      console.error('❌ CategoryService: Fetch error:', error);
      console.error('❌ CategoryService: Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return { data: [] };
    }
  },

  // Get products by category
  async getProductsByCategory(categorySlug, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/products/category/${categorySlug}?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [] };
    }
  },

  // Get all products
  async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [] };
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const url = `${API_BASE_URL}/products/featured`;
      console.log('📡 CategoryService: Fetching featured products from:', url);
      
      const response = await fetch(url);
      console.log('📊 CategoryService: Featured products response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ CategoryService: Featured products error response:', errorText);
        throw new Error(`Failed to fetch featured products: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('⭐ CategoryService: Featured products success! Data:', data);
      return data;
    } catch (error) {
      console.error('❌ CategoryService: Featured products fetch error:', error);
      console.error('❌ CategoryService: Featured products error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return { data: [] };
    }
  }
};
