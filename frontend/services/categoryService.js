// API service for fetching categories and products
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

console.log('🔧 CategoryService initialized with API URL:', API_BASE_URL);

// Mock data for fallback when API is not available
const mockCategories = [
  {
    id: 1,
    name: 'Phone Cases',
    slug: 'phone-cases',
    subcategories: [
      {
        id: 1,
        name: 'iPhone Cases',
        slug: 'iphone-cases',
        sub_subcategories: [
          { id: 1, name: 'iPhone 15 Pro', slug: 'iphone-15-pro' },
          { id: 2, name: 'iPhone 15', slug: 'iphone-15' },
          { id: 3, name: 'iPhone 14', slug: 'iphone-14' }
        ]
      },
      {
        id: 2,
        name: 'Samsung Cases',
        slug: 'samsung-cases',
        sub_subcategories: [
          { id: 4, name: 'Galaxy S24', slug: 'galaxy-s24' },
          { id: 5, name: 'Galaxy S23', slug: 'galaxy-s23' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Wallets',
    slug: 'wallets',
    subcategories: [
      {
        id: 3,
        name: 'Men Wallets',
        slug: 'men-wallets',
        sub_subcategories: [
          { id: 6, name: 'Bifold Wallets', slug: 'bifold-wallets' },
          { id: 7, name: 'Trifold Wallets', slug: 'trifold-wallets' }
        ]
      },
      {
        id: 4,
        name: 'Card Holders',
        slug: 'card-holders',
        sub_subcategories: [
          { id: 8, name: 'Minimal Card Holder', slug: 'minimal-card-holder' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Accessories',
    slug: 'accessories',
    subcategories: [
      {
        id: 5,
        name: 'Tech Accessories',
        slug: 'tech-accessories',
        sub_subcategories: [
          { id: 9, name: 'AirPod Cases', slug: 'airpod-cases' },
          { id: 10, name: 'Watch Bands', slug: 'watch-bands' }
        ]
      }
    ]
  }
];

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
      console.log('🔄 CategoryService: Using mock data as fallback');
      // Return mock data when API fails
      return { data: mockCategories };
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
