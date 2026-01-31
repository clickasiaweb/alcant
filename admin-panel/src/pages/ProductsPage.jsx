import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter, FiImage, FiDollarSign, FiPackage } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import ProductFormModal from "../components/ProductFormModal";
import {
  getAdminProducts,
  getAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../services/api-services";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    oldPrice: "",
    images: [],
    stock: "",
    isActive: true,
    isNew: false,
    isLimitedEdition: false,
    isBlueMondaySale: false,
    rating: 0,
    reviews: 0,
    seoMetaTitle: "",
    seoMetaDescription: "",
    keywords: "",
    taxPercentage: "",
    stockStatus: "in_stock",
    featured: false,
    status: "active",
  });

  useEffect(() => {
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    if (action === "add") {
      setShowForm(true);
    } else if (action === "edit" && id) {
      // Load product for editing
      loadProductForEdit(id);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading data...');
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ]);

      console.log('Products data:', productsData);
      console.log('Categories data:', categoriesData);

      const products = productsData.products || [];
      const categories = categoriesData.categories || [];
      
      console.log('Processed products:', products);
      console.log('Processed categories:', categories);
      
      setProducts(Array.isArray(products) ? products : []);
      setCategories(Array.isArray(categories) ? categories : []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const loadProductForEdit = async (id) => {
    try {
      const product = products.find(p => (p._id || p.id) === id);
      if (product) {
        setEditingProduct(product);
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          shortDescription: product.short_description || "",
          description: product.description || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          price: product.price || "",
          oldPrice: product.old_price || "",
          images: product.images || [],
          stock: product.stock || "",
          isActive: product.is_active !== undefined ? product.is_active : true,
          isNew: product.is_new || false,
          isLimitedEdition: product.is_limited_edition || false,
          isBlueMondaySale: product.is_blue_monday_sale || false,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          seoMetaTitle: product.seo_meta_title || "",
          seoMetaDescription: product.seo_meta_description || "",
          keywords: product.keywords || "",
          taxPercentage: product.tax_percentage || "",
          stockStatus: product.stock_status || "in_stock",
          featured: product.featured || false,
          status: product.status || "active",
        });
        setShowForm(true);
      }
    } catch (error) {
      toast.error("Error loading product");
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === "text" || type === "textarea" || type === "number" || type === "email") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (type === "select-one") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // For other input types
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file
    }));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description || formData.shortDescription || '',
        shortDescription: formData.shortDescription || '',
        price: parseFloat(formData.price) || 0,
        oldPrice: parseFloat(formData.oldPrice) || null,
        final_price: parseFloat(formData.price) || 0, // Required field
        category: formData.category,
        subcategory: formData.subcategory || 'general', // Default value for required field
        images: formData.images || [],
        image: formData.images?.[0]?.url || '', // Use first image as main image
        stock: parseInt(formData.stock) || 0,
        isActive: formData.isActive !== false,
        isNew: formData.isNew || false,
        isLimitedEdition: formData.isLimitedEdition || false,
        isBlueMondaySale: formData.isBlueMondaySale || false,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        seoMetaTitle: formData.seoMetaTitle || '',
        seoMetaDescription: formData.seoMetaDescription || '',
        keywords: formData.keywords || '',
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully!");
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Product creation error:', error);
      toast.error(error.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || product.title || "",
      slug: product.slug || "",
      shortDescription: product.short_description || "",
      description: product.description || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price || product.final_price || "",
      oldPrice: product.old_price || "",
      images: product.images || [],
      stock: product.stock || 0,
      isActive: product.is_active !== false,
      isNew: product.is_new || false,
      isLimitedEdition: product.is_limited_edition || false,
      isBlueMondaySale: product.is_blue_monday_sale || false,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      seoMetaTitle: product.seo_meta_title || "",
      seoMetaDescription: product.seo_meta_description || "",
      keywords: product.keywords || "",
      taxPercentage: product.tax_percentage || "",
      stockStatus: product.stock_status || "in_stock",
      featured: product.featured || false,
      status: product.status || "active",
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully!");
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting product");
      }
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = !product.isActive;
      await updateProductStatus(product._id, newStatus);
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      loadData();
    } catch (error) {
      toast.error("Error updating product status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      subcategory: "",
      price: "",
      oldPrice: "",
      images: [],
      stock: "",
      isActive: true,
      isNew: false,
      isLimitedEdition: false,
      isBlueMondaySale: false,
      rating: 0,
      reviews: 0,
      seoMetaTitle: "",
      seoMetaDescription: "",
      keywords: "",
      taxPercentage: "",
      stockStatus: "in_stock",
      featured: false,
      status: "active",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || product.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && product.is_active) ||
                         (filterStatus === "inactive" && !product.is_active);
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    console.log('ProductsPage: Still loading...');
    return (
      <div className="flex">
        <SidebarNoAuth />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log('ProductsPage: Rendering with products:', products.length, 'products');

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category._id || category.id} value={category._id || category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name || product.title}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name || product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.category || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{product.price || product.final_price}
                          {product.old_price && product.old_price > product.price && (
                            <span className="text-gray-500 line-through ml-2">
                              ₹{product.old_price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id || product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || filterStatus !== "all" || filterCategory !== "all" 
                ? "No products found matching your search criteria."
                : "No products found. Add your first product to get started."
              }
            </div>
          )}
        </div>

        {showForm && (
          <ProductFormModal
            formData={formData}
            editingProduct={editingProduct}
            categories={categories}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />
        )}
      </div>
    </div>
  );
}
