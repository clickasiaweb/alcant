import React, { useState, useEffect } from 'react';

const SubSubCategoryFormModal = ({ 
  formData, 
  editingSubSubCategory, 
  categories,
  handleInputChange, 
  handleSubmit, 
  resetForm 
}) => {
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    // Extract subcategories based on selected category
    if (formData.subcategoryId && categories.length > 0) {
      // Find which category this subcategory belongs to
      let selectedCategory = null;
      let subcategories = [];
      
      categories.forEach(category => {
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            if (subcategory.id === formData.subcategoryId) {
              selectedCategory = category;
            }
            subcategories.push({
              id: subcategory.id,
              name: subcategory.name,
              category_name: category.name
            });
          });
        }
      });
      
      setAvailableSubcategories(subcategories);
    } else {
      // Show all subcategories
      const allSubcategories = [];
      categories.forEach(category => {
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            allSubcategories.push({
              id: subcategory.id,
              name: subcategory.name,
              category_name: category.name
            });
          });
        }
      });
      setAvailableSubcategories(allSubcategories);
    }
  }, [formData.subcategoryId, categories]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
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

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);
    
    // Auto-generate slug if slug is empty
    if (name === 'name' && !formData.slug) {
      handleInputChange({
        target: {
          name: 'slug',
          value: generateSlug(value)
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingSubSubCategory ? "Edit Sub-Subcategory" : "Add New Sub-Subcategory"}
        </h2>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Subcategory Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Gaming Laptops"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., gaming-laptops"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Subcategory *
            </label>
            <select
              name="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a subcategory</option>
              {availableSubcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name} ({subcategory.category_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the sub-subcategory"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingSubSubCategory ? "Update" : "Create"} Sub-Subcategory
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubSubCategoryFormModal;
