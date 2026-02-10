import apiClient from "./api";

// Auth
export const login = async (email, password) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await apiClient.post("/auth/register", {
    name,
    email,
    password,
  });
  return data;
};

// Products
export const getProducts = async (params) => {
  const { data } = await apiClient.get("/products", { params });
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await apiClient.post("/admin/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await apiClient.put(`/admin/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await apiClient.delete(`/admin/products/${id}`);
  return data;
};

// Categories
export const getCategories = async () => {
  const { data } = await apiClient.get("/categories");
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await apiClient.post("/admin/category", categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await apiClient.put(`/admin/category/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await apiClient.delete(`/admin/category/${id}`);
  return data;
};

// Inquiries
export const getInquiries = async (params) => {
  const { data } = await apiClient.get("/inquiries", { params });
  return data;
};

export const updateInquiry = async (id, updates) => {
  const { data } = await apiClient.put(`/inquiries/${id}`, updates);
  return data;
};

export const deleteInquiry = async (id) => {
  const { data } = await apiClient.delete(`/inquiries/${id}`);
  return data;
};

// Content
export const getContent = async (pageKey) => {
  const { data } = await apiClient.get(`/content/${pageKey}`);
  return data;
};

export const updateContent = async (pageKey, contentData) => {
  try {
    console.log('API call:', `PUT /content/${pageKey}`, contentData);
    const { data } = await apiClient.put(`/content/${pageKey}`, contentData);
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    throw error;
  }
};

// Admin Dashboard
export const getDashboardSummary = async () => {
  const { data } = await apiClient.get("/admin/dashboard-summary");
  return data;
};

// Admin Products
export const getAdminProducts = async (params) => {
  const { data } = await apiClient.get("/admin/products", { params });
  return data;
};

export const updateProductStatus = async (id, isActive) => {
  const { data } = await apiClient.patch(`/admin/product/status/${id}`, { isActive });
  return data;
};

// Admin Categories - Updated for 3-level hierarchy
export const getAdminCategories = async () => {
  try {
    const { data } = await apiClient.get("/categories/all/with-subcategories");
    return data;
  } catch (error) {
    // Fallback to admin endpoint
    const { data } = await apiClient.get("/admin/categories");
    return data;
  }
};

export const createAdminCategory = async (categoryData) => {
  const { data } = await apiClient.post("/admin/category", categoryData);
  return data;
};

export const getAdminSubCategories = async () => {
  const { data } = await apiClient.get("/admin/subcategories");
  return data;
};

export const getAdminSubSubCategories = async () => {
  const { data } = await apiClient.get("/admin/sub-subcategories");
  return data;
};

export const createAdminSubCategory = async (categoryData) => {
  const { data } = await apiClient.post("/admin/subcategory", categoryData);
  return data;
};

export const createAdminSubSubCategory = async (categoryData) => {
  console.log('🔍 API: Creating sub-subcategory with data:', categoryData);
  console.log('🌐 API: Base URL:', apiClient.defaults.baseURL);
  
  try {
    const response = await apiClient.post("/admin/sub-subcategory", categoryData);
    console.log('✅ API: Create response:', response.data);
    console.log('📊 API: Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ API: Create error:', error);
    console.error('❌ API: Error response:', error.response?.data);
    console.error('❌ API: Error status:', error.response?.status);
    console.error('❌ API: Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - backend might not be running');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - CORS or connectivity issue');
    }
    
    throw error;
  }
};

export const updateAdminCategory = async (id, categoryData) => {
  const { data } = await apiClient.put(`/admin/category/${id}`, categoryData);
  return data;
};

export const updateAdminSubCategory = async (id, categoryData) => {
  const { data } = await apiClient.put(`/admin/subcategory/${id}`, categoryData);
  return data;
};

export const updateAdminSubSubCategory = async (id, categoryData) => {
  const { data } = await apiClient.put(`/admin/sub-subcategory/${id}`, categoryData);
  return data;
};

export const deleteAdminCategory = async (id) => {
  const { data } = await apiClient.delete(`/admin/category/${id}`);
  return data;
};

export const deleteAdminSubCategory = async (id) => {
  const { data } = await apiClient.delete(`/admin/subcategory/${id}`);
  return data;
};

export const deleteAdminSubSubCategory = async (id) => {
  const { data } = await apiClient.delete(`/admin/sub-subcategory/${id}`);
  return data;
};

// Admin Inquiries
export const getAdminInquiries = async (params) => {
  const { data } = await apiClient.get("/admin/inquiries", { params });
  return data;
};

export const updateInquiryStatus = async (id, status, response) => {
  const { data } = await apiClient.patch(`/admin/inquiry/${id}/status`, { status, response });
  return data;
};
