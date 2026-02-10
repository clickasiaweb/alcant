import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import SubSubCategoryFormModal from "../components/SubSubCategoryFormModal";
import { 
  getAdminCategories,
  getAdminSubSubCategories,
  createAdminSubSubCategory,
  updateAdminSubSubCategory,
  deleteAdminSubSubCategory
} from "../services/api-services";
import { toast } from "react-toastify";

export default function SubSubCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubSubCategory, setEditingSubSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subcategoryId: "",
    description: "",
    sortOrder: 0,
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
      const categoriesList = categoriesData.data || [];
      setCategories(categoriesList);
      
      // Load sub-subcategories directly from dedicated endpoint
      const subSubCategoriesData = await getAdminSubSubCategories();
      const subSubCategoriesList = subSubCategoriesData.data || [];
      setSubSubCategories(subSubCategoriesList);
    } catch (error) {
      toast.error("Error loading sub-subcategories");
      console.error("Error loading sub-subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Add a random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomSuffix}`;
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    console.log('📝 Input changed:', { name, value, type, checked });
    
    if (type === "text" || type === "textarea" || type === "number" || type === "email") {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        console.log('🔄 Form data updated:', newData);
        return newData;
      });
    } else if (type === "select-one") {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        console.log('🔄 Form data updated (select):', newData);
        return newData;
      });
    } else {
      // For checkboxes
      setFormData(prev => {
        const newData = { ...prev, [name]: checked };
        console.log('🔄 Form data updated (checkbox):', newData);
        return newData;
      });
    }
  }, []);

  // Force recompile
  console.log('🔄 Admin panel recompiled at:', new Date().toISOString());

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔥🔥🔥 NEW handleSubmit function called! 🔥🔥🔥');
    
    // Ensure slug is generated if empty
    const finalFormData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name)
    };
    
    console.log('🚀 Submitting sub-subcategory:', finalFormData);
    
    try {
      if (editingSubSubCategory) {
        console.log('📝 Updating sub-subcategory:', editingSubSubCategory.id);
        await updateAdminSubSubCategory(editingSubSubCategory.id, finalFormData);
        toast.success("Sub-subcategory updated successfully!");
      } else {
        console.log('➕ Creating new sub-subcategory');
        const result = await createAdminSubSubCategory(finalFormData);
        console.log('✅ Create result:', result);
        toast.success("Sub-subcategory created successfully!");
      }
      
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error creating/updating sub-subcategory:", error);
      toast.error("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (subSubCategory) => {
    setEditingSubSubCategory(subSubCategory);
    setFormData({
      name: subSubCategory.name || "",
      slug: subSubCategory.slug || "",
      subcategoryId: subSubCategory.subcategory_id || "",
      description: subSubCategory.description || "",
      sortOrder: subSubCategory.sort_order || 0,
      isActive: subSubCategory.is_active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (subSubCategoryId) => {
    if (window.confirm("Are you sure you want to delete this sub-subcategory? This action cannot be undone.")) {
      try {
        await deleteAdminSubSubCategory(subSubCategoryId);
        toast.success("Sub-subcategory deleted successfully!");
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting sub-subcategory");
      }
    }
  };

  const handleToggleStatus = async (subSubCategory) => {
    try {
      await updateAdminSubSubCategory(subSubCategory.id, { 
        ...subSubCategory, 
        is_active: !subSubCategory.is_active 
      });
      toast.success(`Sub-subcategory ${subSubCategory.is_active ? "deactivated" : "activated"} successfully!`);
      loadData();
    } catch (error) {
      toast.error("Error updating sub-subcategory status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      subcategoryId: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    });
    setEditingSubSubCategory(null);
    setShowForm(false);
  };

  // Get unique categories and subcategories for filters
  const uniqueCategories = [...new Set(categories.map(cat => cat.name))];
  const uniqueSubCategories = [...new Set(subSubCategories.map(item => item.subcategory_name))];

  const filteredSubSubCategories = subSubCategories.filter(subSub => {
    const matchesSearch = subSub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subSub.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "active" && subSub.is_active !== false) ||
                         (filterStatus === "inactive" && subSub.is_active === false);
    const matchesCategory = !filterCategory || subSub.category_name === filterCategory;
    const matchesSubCategory = !filterSubCategory || subSub.subcategory_name === filterSubCategory;
    
    return matchesSearch && matchesFilter && matchesCategory && matchesSubCategory;
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
          <h1 className="text-3xl font-bold text-gray-900">Sub-Subcategories Management</h1>
          <p className="text-gray-600 mt-2">Manage third-level categories (sub-subcategories)</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sub-subcategories..."
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

              <select
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subcategories</option>
                {uniqueSubCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add Sub-Subcategory
            </button>
          </div>
        </div>

        {/* Sub-Subcategories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredSubSubCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sort Order
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
                  {filteredSubSubCategories.map((subSubCategory) => (
                    <tr key={subSubCategory.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subSubCategory.name}
                            </div>
                            {subSubCategory.description && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {subSubCategory.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subSubCategory.category_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subSubCategory.subcategory_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {subSubCategory.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subSubCategory.sort_order || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subSubCategory.is_active !== false 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subSubCategory.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleStatus(subSubCategory)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                          title={subSubCategory.is_active !== false ? "Deactivate" : "Activate"}
                        >
                          {subSubCategory.is_active !== false ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(subSubCategory)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subSubCategory.id)}
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
              {searchTerm || filterStatus !== "all" || filterCategory || filterSubCategory
                ? "No sub-subcategories found matching your search criteria."
                : "No sub-subcategories found. Add your first sub-subcategory to get started."
              }
            </div>
          )}
        </div>

        {showForm && (
          <SubSubCategoryFormModal
            formData={formData}
            editingSubSubCategory={editingSubSubCategory}
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
