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

// Admin Categories
export const getAdminCategories = async () => {
  const { data } = await apiClient.get("/admin/categories");
  return data;
};

export const createAdminCategory = async (categoryData) => {
  const { data } = await apiClient.post("/admin/category", categoryData);
  return data;
};

export const updateAdminCategory = async (id, categoryData) => {
  const { data } = await apiClient.put(`/admin/category/${id}`, categoryData);
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
