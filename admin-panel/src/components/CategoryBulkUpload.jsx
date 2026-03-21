import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiFile, FiCheckCircle, FiAlertCircle, FiX, FiLoader } from 'react-icons/fi';

const CategoryBulkUpload = () => {
  const [uploadStep, setUploadStep] = useState(1); // 1: template, 2: upload, 3: processing, 4: results
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/categories/bulk/template');
      if (!response.ok) {
        throw new Error('Failed to download template');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'category-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download template. Please try again.');
      console.error('Template download error:', err);
    }
  };

  // File dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError('');
      setUploadStep(2);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  // Upload and process file
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');
    setUploadStep(3);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/categories/bulk/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadResults(result);
      setUploadStep(4);
    } catch (err) {
      setError(err.message);
      setUploadStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset upload
  const resetUpload = () => {
    setSelectedFile(null);
    setUploadResults(null);
    setError('');
    setUploadStep(1);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Bulk Category Upload</h1>
          <p className="text-gray-600 mt-1">
            Upload categories, subcategories, and sub-subcategories in bulk using Excel files
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {['Template', 'Upload', 'Processing', 'Results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  uploadStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : uploadStep === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {uploadStep > index + 1 ? <FiCheckCircle size={16} /> : index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  uploadStep >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    uploadStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Step 1: Template Download */}
          {uploadStep === 1 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FiFile className="text-blue-600" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Download Excel Template
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Download the pre-formatted Excel template to add your categories, subcategories, and sub-subcategories.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-2xl mx-auto mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Template includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Categories Sheet:</strong> Main categories with name, slug, description</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Subcategories Sheet:</strong> Second-level categories linked to main categories</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Sub-Subcategories Sheet:</strong> Third-level categories linked to subcategories</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Reference Sheet:</strong> Existing categories for reference</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={downloadTemplate}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiDownload className="mr-2" />
                Download Template
              </button>
            </div>
          )}

          {/* Step 2: File Upload */}
          {uploadStep === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Your Excel File
                </h2>
                <p className="text-gray-600">
                  Drag and drop your filled Excel template or click to browse
                </p>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto text-gray-400 mb-4" size={48} />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the Excel file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag and drop your Excel file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: .xlsx, .xls (Max file size: 10MB)
                    </p>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiFile className="text-green-600 mr-3" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={resetUpload}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Upload & Process
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {uploadStep === 3 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FiLoader className="text-blue-600 animate-spin" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Your File
              </h2>
              <p className="text-gray-600">
                Please wait while we process your categories...
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {uploadStep === 4 && uploadResults && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Complete!
                </h2>
                <p className="text-gray-600">
                  Your categories have been processed successfully.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="text-2xl font-bold text-green-900">{uploadResults.totalCreated}</p>
                      <p className="text-sm text-green-700">Total Created</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-blue-600 mr-3" size={20} />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">
                        {uploadResults.results.categories.created + 
                         uploadResults.results.subcategories.created + 
                         uploadResults.results.subSubcategories.created}
                      </p>
                      <p className="text-sm text-blue-700">Successful</p>
                    </div>
                  </div>
                </div>

                {uploadResults.totalErrors > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiAlertCircle className="text-red-600 mr-3" size={20} />
                      <div>
                        <p className="text-2xl font-bold text-red-900">{uploadResults.totalErrors}</p>
                        <p className="text-sm text-red-700">Errors</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Results */}
              <div className="space-y-4 mb-6">
                {/* Categories */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Created: {uploadResults.results.categories.created}</span>
                    </div>
                    {uploadResults.results.categories.errors.length > 0 && (
                      <div>
                        <span className="text-red-600">Errors: {uploadResults.results.categories.errors.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Subcategories</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Created: {uploadResults.results.subcategories.created}</span>
                    </div>
                    {uploadResults.results.subcategories.errors.length > 0 && (
                      <div>
                        <span className="text-red-600">Errors: {uploadResults.results.subcategories.errors.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Subcategories */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Sub-Subcategories</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Created: {uploadResults.results.subSubcategories.created}</span>
                    </div>
                    {uploadResults.results.subSubcategories.errors.length > 0 && (
                      <div>
                        <span className="text-red-600">Errors: {uploadResults.results.subSubcategories.errors.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {uploadResults.totalErrors > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-red-900 mb-2">Error Details</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[...uploadResults.results.categories.errors,
                      ...uploadResults.results.subcategories.errors,
                      ...uploadResults.results.subSubcategories.errors].map((error, index) => (
                      <p key={index} className="text-sm text-red-700">{error}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetUpload}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBulkUpload;
