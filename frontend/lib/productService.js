import apiClient from './api';

// Mock products for fallback when API is not available
const mockProducts = [
  {
    id: 1,
    name: 'Premium iPhone 15 Pro Case',
    slug: 'premium-iphone-15-pro-case',
    price: 49.99,
    category: 'phone-cases',
    subcategory: 'iphone-cases',
    image: 'https://picsum.photos/seed/iphone15pro/300/300.jpg'
  },
  {
    id: 2,
    name: 'Luxury Leather Wallet',
    slug: 'luxury-leather-wallet',
    price: 89.99,
    category: 'wallets',
    subcategory: 'men-wallets',
    image: 'https://picsum.photos/seed/wallet1/300/300.jpg'
  },
  {
    id: 3,
    name: 'Alcantara AirPod Case',
    slug: 'alcantara-airpod-case',
    price: 34.99,
    category: 'accessories',
    subcategory: 'tech-accessories',
    image: 'https://picsum.photos/seed/airpod1/300/300.jpg'
  }
];

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
      // Return mock product when API fails
      const mockProduct = mockProducts.find(p => p.slug === slug);
      if (mockProduct) {
        return mockProduct;
      }
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
      // Return mock products when API fails
      const filteredProducts = mockProducts.filter(p => 
        p.category === categorySlug && p.subcategory === subcategorySlug
      );
      return {
        products: filteredProducts.slice(0, options.limit || 8),
        total: filteredProducts.length
      };
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
      // Return mock products when API fails
      const filteredProducts = mockProducts.filter(p => p.category === categorySlug);
      return {
        products: filteredProducts.slice(0, options.limit || 8),
        total: filteredProducts.length
      };
    }
  },
};
