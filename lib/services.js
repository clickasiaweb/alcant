import apiClient from "./api";

export const fetchProducts = async (params = {}) => {
  try {
    const response = await apiClient.get("/products", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchRecommendedProducts = async (params = {}) => {
  try {
    const response = await apiClient.get("/products/recommended", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchProductBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitInquiry = async (inquiryData) => {
  try {
    const response = await apiClient.post("/inquiries", inquiryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchContent = async (pageKey) => {
  try {
    const response = await apiClient.get(`/content/${pageKey}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
