import React, { useState, useEffect } from 'react';

const Sub3CategoryFormModal = ({ 
  formData, 
  editingSub3Category, 
  categories,
  allSubSubcategories,
  handleInputChange, 
  handleSubmit, 
  resetForm 
}) => {
  const [availableSubSubcategories, setAvailableSubSubcategories] = useState([]);

  useEffect(() => {
    // Set available sub-subcategories directly from the prop
    console.log('🔍 Sub3CategoryFormModal - allSubSubcategories prop:', allSubSubcategories);
    console.log('🔍 Sub3CategoryFormModal - allSubSubcategories length:', allSubSubcategories?.length);
    
    if (allSubSubcategories && allSubSubcategories.length > 0) {
      console.log('✅ Setting available sub-subcategories:', allSubSubcategories.length);
      setAvailableSubSubcategories(allSubSubcategories);
    } else {
      console.log('⚠️ No sub-subcategories available or still loading...');
    }
  }, [allSubSubcategories]);

  const generateSlug = (name) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Add a random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomSuffix}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingSub3Category ? 'Edit Sub3 Category' : 'Add New Sub3 Category'}
          </h2>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-generated from name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Sub-Subcategory *
            </label>
            <select
              name="subSubCategoryId"
              value={formData.subSubCategoryId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!allSubSubcategories || allSubSubcategories.length === 0}
            >
              <option value="">Select a sub-subcategory</option>
              {allSubSubcategories && allSubSubcategories.length > 0 && (
                <>
                  {allSubSubcategories.map(subSub => (
                    <option key={subSub.id} value={subSub.id}>
                      {subSub.category_name} → {subSub.subcategory_name} → {subSub.name}
                    </option>
                  ))}
                </>
              )}
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingSub3Category ? 'Update Sub3 Category' : 'Create Sub3 Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sub3CategoryFormModal;
