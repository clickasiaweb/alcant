import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import Sub3CategoryFormModal from "../components/Sub3CategoryFormModal";
import { 
  getAdminCategories,
  getAdminSub3Categories,
  createAdminSub3Category,
  updateAdminSub3Category,
  deleteAdminSub3Category
} from "../services/api-services";
import { toast } from "react-toastify";

export default function Sub3CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [sub3Categories, setSub3Categories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSub3Category, setEditingSub3Category] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [filterSubSubCategory, setFilterSubSubCategory] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subSubCategoryId: "",
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
      
      // Extract all sub-subcategories from the hierarchical data
      const allSubSubcategories = [];
      categoriesList.forEach(category => {
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            if (subcategory.sub_subcategories) {
              subcategory.sub_subcategories.forEach(subSub => {
                allSubSubcategories.push({
                  id: subSub.id,
                  name: subSub.name,
                  subcategory_name: subcategory.name,
                  category_name: category.name
                });
              });
            }
          });
        }
      });
      
      setCategories(categoriesList);
      
      // Debug: Log what we're passing to the form modal
      console.log('🔍 Sub3CategoriesPage - allSubSubcategories extracted:', allSubSubcategories.length);
      console.log('🔍 Sub3CategoriesPage - passing to form modal:', allSubSubcategories.slice(0, 3));
      
      // Load sub3 categories directly from dedicated endpoint
      const sub3CategoriesData = await getAdminSub3Categories();
      const sub3CategoriesList = sub3CategoriesData.data || [];
      setSub3Categories(sub3CategoriesList);
    } catch (error) {
      toast.error("Error loading sub3 categories");
      console.error("Error loading sub3 categories:", error);
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
    
    console.log('🚀 Submitting sub3 category:', finalFormData);
    
    try {
      if (editingSub3Category) {
        console.log('📝 Updating sub3 category:', editingSub3Category.id);
        await updateAdminSub3Category(editingSub3Category.id, finalFormData);
        toast.success("Sub3 category updated successfully!");
      } else {
        console.log('➕ Creating new sub3 category');
        const result = await createAdminSub3Category(finalFormData);
        console.log('✅ Create result:', result);
        toast.success("Sub3 category created successfully!");
      }
      
      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error creating/updating sub3 category:", error);
      toast.error("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (sub3Category) => {
    setEditingSub3Category(sub3Category);
    setFormData({
      name: sub3Category.name || "",
      slug: sub3Category.slug || "",
      subSubCategoryId: sub3Category.sub_subcategory_id || "",
      description: sub3Category.description || "",
      sortOrder: sub3Category.sort_order || 0,
      isActive: sub3Category.is_active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (sub3CategoryId) => {
    if (window.confirm("Are you sure you want to delete this sub3 category? This action cannot be undone.")) {
      try {
        await deleteAdminSub3Category(sub3CategoryId);
        toast.success("Sub3 category deleted successfully!");
        loadData();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting sub3 category");
      }
    }
  };

  const handleToggleStatus = async (sub3Category) => {
    try {
      await updateAdminSub3Category(sub3Category.id, { 
        ...sub3Category, 
        is_active: !sub3Category.is_active 
      });
      toast.success(`Sub3 category ${sub3Category.is_active ? "deactivated" : "activated"} successfully!`);
      loadData();
    } catch (error) {
      toast.error("Error updating sub3 category status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      subSubCategoryId: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    });
    setEditingSub3Category(null);
    setShowForm(false);
  };

  // Get unique categories, subcategories, and sub-subcategories for filters
  const uniqueCategories = [...new Set(categories.map(cat => cat.name))];
  const uniqueSubCategories = [...new Set(sub3Categories.map(item => item.subcategory_name))];
  const uniqueSubSubCategories = [...new Set(sub3Categories.map(item => item.sub_subcategory_name))];

  const filteredSub3Categories = sub3Categories.filter(sub3 => {
    const matchesSearch = sub3.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub3.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "active" && sub3.is_active !== false) ||
                         (filterStatus === "inactive" && sub3.is_active === false);
    const matchesCategory = !filterCategory || sub3.category_name === filterCategory;
    const matchesSubCategory = !filterSubCategory || sub3.subcategory_name === filterSubCategory;
    const matchesSubSubCategory = !filterSubSubCategory || sub3.sub_subcategory_name === filterSubSubCategory;
    
    return matchesSearch && matchesFilter && matchesCategory && matchesSubCategory && matchesSubSubCategory;
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
          <h1 className="text-3xl font-bold text-gray-900">Sub3 Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage fourth-level categories (sub3 categories)</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sub3 categories..."
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

              <select
                value={filterSubSubCategory}
                onChange={(e) => setFilterSubSubCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sub-Subcategories</option>
                {uniqueSubSubCategories.map(subSub => (
                  <option key={subSub} value={subSub}>{subSub}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add Sub3 Category
            </button>
          </div>
        </div>

        {/* Sub3 Categories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredSub3Categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub3 Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-Subcategory
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
                  {filteredSub3Categories.map((sub3Category) => (
                    <tr key={sub3Category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sub3Category.name}
                            </div>
                            {sub3Category.description && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {sub3Category.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sub3Category.category_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sub3Category.subcategory_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sub3Category.sub_subcategory_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {sub3Category.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sub3Category.sort_order || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sub3Category.is_active !== false 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sub3Category.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleStatus(sub3Category)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                          title={sub3Category.is_active !== false ? "Deactivate" : "Activate"}
                        >
                          {sub3Category.is_active !== false ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(sub3Category)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub3Category.id)}
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
              {searchTerm || filterStatus !== "all" || filterCategory || filterSubCategory || filterSubSubCategory
                ? "No sub3 categories found matching your search criteria."
                : "No sub3 categories found. Add your first sub3 category to get started."
              }
            </div>
          )}
        </div>

        {showForm && (
          <Sub3CategoryFormModal
            formData={formData}
            editingSub3Category={editingSub3Category}
            categories={categories}
            allSubSubcategories={allSubSubcategories}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
          />
        )}
      </div>
    </div>
  );
}
