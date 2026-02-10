import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import SubCategoryFormModal from "../components/SubCategoryFormModal";
import { 
  getAdminCategories,
  getAdminSubCategories,
  createAdminSubCategory,
  updateAdminSubCategory,
  deleteAdminSubCategory
} from "../services/api-services";
import { toast } from "react-toastify";

export default function SubCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories for dropdown
      const categoriesData = await getAdminCategories();
      const categoriesList = categoriesData.data || categoriesData || [];
      setCategories(categoriesList);
      
      // Load subcategories directly
      const subcategoriesData = await getAdminSubCategories();
      const subcategoriesList = subcategoriesData.data || [];
      setSubCategories(subcategoriesList);
    } catch (error) {
      toast.error("Error loading subcategories");
      console.error("Error loading subcategories:", error);
    } finally {
      setLoading(false);
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
    
    if (type === "text" || type === "textarea" || type === "number" || type === "email") {
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
      // For checkboxes
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubCategory) {
        await updateAdminSubCategory(editingSubCategory.id, formData);
        toast.success("Subcategory updated successfully!");
      } else {
        await createAdminSubCategory(formData);
        toast.success("Subcategory created successfully!");
      }
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving subcategory");
    }
  };

  const handleEdit = (subCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name || "",
      slug: subCategory.slug || "",
      categoryId: subCategory.category_id || "",
      description: subCategory.description || "",
      isActive: subCategory.is_active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (subCategoryId) => {
    if (window.confirm("Are you sure you want to delete this subcategory? This will also delete all associated sub-subcategories.")) {
      try {
        await deleteAdminSubCategory(subCategoryId);
        toast.success("Subcategory deleted successfully!");
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting subcategory");
      }
    }
  };

  const handleToggleStatus = async (subCategory) => {
    try {
      await updateAdminSubCategory(subCategory.id, { 
        ...subCategory, 
        is_active: !subCategory.is_active 
      });
      toast.success(`Subcategory ${subCategory.is_active ? "deactivated" : "activated"} successfully!`);
      loadData();
    } catch (error) {
      toast.error("Error updating subcategory status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      categoryId: "",
      description: "",
      isActive: true,
    });
    setEditingSubCategory(null);
    setShowForm(false);
  };

  // Get unique categories for filters
  const uniqueCategories = [...new Set(categories.map(cat => cat.name))];

  const filteredSubCategories = subCategories.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "active" && sub.is_active !== false) ||
                         (filterStatus === "inactive" && sub.is_active === false);
    const matchesCategory = !filterCategory || sub.category_name === filterCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  if (loading) {
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

  return (
    <div className="flex">
      <SidebarNoAuth />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subcategories Management</h1>
          <p className="text-gray-600 mt-2">Manage second-level categories (subcategories)</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subcategories..."
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
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add Subcategory
            </button>
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredSubCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-subcategories
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
                  {filteredSubCategories.map((subCategory) => (
                    <tr key={subCategory.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subCategory.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subCategory.category_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {subCategory.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {subCategory.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subCategory.sub_subcategories ? subCategory.sub_subcategories.length : 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subCategory.is_active !== false 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subCategory.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleStatus(subCategory)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                          title={subCategory.is_active !== false ? "Deactivate" : "Activate"}
                        >
                          {subCategory.is_active !== false ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(subCategory)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subCategory.id)}
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
              {searchTerm || filterStatus !== "all" || filterCategory
                ? "No subcategories found matching your search criteria."
                : "No subcategories found. Add your first subcategory to get started."
              }
            </div>
          )}
        </div>

        {showForm && (
          <SubCategoryFormModal
            formData={formData}
            editingSubCategory={editingSubCategory}
            categories={categories}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
          />
        )}
      </div>
    </div>
  );
}
