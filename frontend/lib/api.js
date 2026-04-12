import axios from "axios";
import apiCache from './apiCache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Reduced timeout for better UX
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  // Add caching for GET requests
  if (config.method === 'get') {
    const cacheKey = `${config.baseURL}${config.url}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      config.adapter = () => Promise.resolve({ data: cachedData });
    }
  }
  
  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cache responses for GET requests
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.baseURL}${response.config.url}`;
      const ttl = response.config.cacheTTL || 5 * 60 * 1000; // 5 minutes default
      apiCache.set(cacheKey, response.data, ttl);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced API methods with caching
export const api = {
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },
  
  post: (url, data, config = {}) => {
    // Invalidate relevant cache on POST
    const cacheKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes('/products') || key.includes('/categories')
    );
    cacheKeys.forEach(key => apiCache.delete(key));
    
    return apiClient.post(url, data, config);
  },
  
  put: (url, data, config = {}) => {
    // Invalidate relevant cache on PUT
    const cacheKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes('/products') || key.includes('/categories')
    );
    cacheKeys.forEach(key => apiCache.delete(key));
    
    return apiClient.put(url, data, config);
  },
  
  delete: (url, config = {}) => {
    // Invalidate relevant cache on DELETE
    const cacheKeys = Array.from(apiCache.cache.keys()).filter(key => 
      key.includes('/products') || key.includes('/categories')
    );
    cacheKeys.forEach(key => apiCache.delete(key));
    
    return apiClient.delete(url, config);
  },
};

export default apiClient;
