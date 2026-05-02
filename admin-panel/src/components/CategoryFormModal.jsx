import React, { useState, useEffect } from 'react';

const CategoryFormModal = ({ 
  formData, 
  editingCategory, 
  handleInputChange, 
  handleSubmit, 
  resetForm 
}) => {
  const [slugPreview, setSlugPreview] = useState('');

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Update slug preview when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const autoSlug = generateSlug(formData.name);
      setSlugPreview(autoSlug);
    } else {
      setSlugPreview(formData.slug);
    }
  }, [formData.name, formData.slug]);

  // Handle name change with auto-slug generation
  const handleNameChange = (e) => {
    const newName = e.target.value;
    handleInputChange(e);
    
    // Auto-generate slug if slug field is empty
    if (!formData.slug && newName) {
      const autoSlug = generateSlug(newName);
      setSlugPreview(autoSlug);
      // Trigger slug field update
      const slugEvent = {
        target: {
          name: 'slug',
          value: autoSlug
        }
      };
      handleInputChange(slugEvent);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Phone Cases"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., phone-cases"
            />
            {slugPreview && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <span className="text-gray-600">Collection URL will be:</span>
                <br />
                <code className="text-blue-600 font-mono">
                  /collections/{slugPreview}
                </code>
              </div>
            )}
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
              placeholder="Brief description of the category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., phone"
            />
          </div>

          <div className="flex items-center">
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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingCategory ? "Update" : "Create"} Category
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

export default CategoryFormModal;
