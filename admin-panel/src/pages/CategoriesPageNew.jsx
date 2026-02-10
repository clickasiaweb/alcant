import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter, FiChevronDown, FiChevronRight } from "react-icons/fi";
import SidebarNoAuth from "../components/SidebarNoAuth";
import CategoryFormModal from "../components/CategoryFormModal";
import { 
  getAdminCategories, 
  createAdminCategory, 
  createAdminSubCategory,
  createAdminSubSubCategory,
  updateAdminCategory, 
  updateAdminSubCategory,
  updateAdminSubSubCategory,
  deleteAdminCategory,
  deleteAdminSubCategory,
  deleteAdminSubSubCategory
} from "../services/api-services";
import { toast } from "react-toastify";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    sort_order: 0,
    isActive: true,
  });

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      setShowForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      const categoriesData = data.data || data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error("Error loading categories");
      console.error("Error loading categories:", error);
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update based on category level
        if (editingCategory.level === 'category') {
          await updateAdminCategory(editingCategory.id, formData);
        } else if (editingCategory.level === 'subcategory') {
          await updateAdminSubCategory(editingCategory.id, formData);
        } else if (editingCategory.level === 'sub-subcategory') {
          await updateAdminSubSubCategory(editingCategory.id, formData);
        }
        toast.success("Category updated successfully!");
      } else {
        await createAdminCategory(formData);
        toast.success("Category created successfully!");
      }
      resetForm();
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving category");
    }
  };

  const handleEdit = (category, level, parentId = null) => {
    setEditingCategory({ ...category, level, parentId });
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      icon: category.icon || "",
      image: category.image || "",
      sort_order: category.sort_order || 0,
      isActive: category.is_active !== false,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId, level) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        if (level === 'category') {
          await deleteAdminCategory(categoryId);
        } else if (level === 'subcategory') {
          await deleteAdminSubCategory(categoryId);
        } else if (level === 'sub-subcategory') {
          await deleteAdminSubSubCategory(categoryId);
        }
        toast.success("Category deleted successfully!");
        loadCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting category");
      }
    }
  };

  const handleToggleStatus = async (category, level) => {
    try {
      const updateData = { ...category, is_active: !category.is_active };
      if (level === 'category') {
        await updateAdminCategory(category.id, updateData);
      } else if (level === 'subcategory') {
        await updateAdminSubCategory(category.id, updateData);
      } else if (level === 'sub-subcategory') {
        await updateAdminSubSubCategory(category.id, updateData);
      }
      toast.success(`Category ${category.is_active ? "deactivated" : "activated"} successfully!`);
      loadCategories();
    } catch (error) {
      toast.error("Error updating category status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      image: "",
      sort_order: 0,
      isActive: true,
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategoryExpansion = (subcategoryId) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId]
    }));
  };

  const filterCategories = (items, level = 0) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" ||
                           (filterStatus === "active" && item.is_active !== false) ||
                           (filterStatus === "inactive" && item.is_active === false);
      return matchesSearch && matchesFilter;
    });
  };

  const renderCategoryRow = (category, level = 0, paddingLeft = 0) => {
    const isExpanded = level === 0 ? expandedCategories[category.id] : expandedSubcategories[category.id];
    const hasChildren = category.subcategories && category.subcategories.length > 0;
    const currentLevel = level === 0 ? 'category' : level === 1 ? 'subcategory' : 'sub-subcategory';

    return (
      <React.Fragment key={category.id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ paddingLeft: `${paddingLeft}px` }}>
              {hasChildren && (
                <button
                  onClick={() => level === 0 ? toggleCategoryExpansion(category.id) : toggleSubcategoryExpansion(category.id)}
                  className="mr-2 text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                </button>
              )}
              {!hasChildren && level > 0 && <span className="mr-6" />}
              {category.icon && (
                <span className="text-2xl mr-3">{category.icon}</span>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                  {level === 1 && <span className="ml-2 text-xs text-gray-500">(Subcategory)</span>}
                  {level === 2 && <span className="ml-2 text-xs text-gray-500">(Sub-subcategory)</span>}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">
              {category.slug}
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {category.description || "-"}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.is_active !== false 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.is_active !== false ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              onClick={() => handleToggleStatus(category, currentLevel)}
              className="text-gray-600 hover:text-gray-900 mr-3"
              title={category.is_active !== false ? "Deactivate" : "Activate"}
            >
              {category.is_active !== false ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleEdit(category, currentLevel)}
              className="text-blue-600 hover:text-blue-900 mr-3"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id, currentLevel)}
              className="text-red-600 hover:text-red-900"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
        {hasChildren && isExpanded && (
          <>
            {category.subcategories.map(subcategory => 
              renderCategoryRow(subcategory, 1, paddingLeft + 24)
            )}
          </>
        )}
      </React.Fragment>
    );
  };

  const filteredCategories = filterCategories(categories);

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
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage product categories, subcategories, and sub-subcategories</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
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
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
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
                  {filteredCategories.map((category) => renderCategoryRow(category))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || filterStatus !== "all" 
                ? "No categories found matching your search criteria."
                : "No categories found. Add your first category to get started."
              }
            </div>
          )}
        </div>

        {showForm && (
          <CategoryFormModal
            formData={formData}
            editingCategory={editingCategory}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
          />
        )}
      </div>
    </div>
  );
}
