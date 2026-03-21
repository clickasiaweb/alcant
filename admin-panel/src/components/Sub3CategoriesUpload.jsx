import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiFile, FiCheckCircle, FiAlertCircle, FiX, FiLoader, FiLayers, FiSmartphone } from 'react-icons/fi';

const Sub3CategoriesUpload = () => {
  const [uploadStep, setUploadStep] = useState(1); // 1: template, 2: upload, 3: processing, 4: results
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Download template
  const downloadTemplate = async () => {
    try {
      console.log('Starting Sub3 Categories CSV template download...');
      
      const response = await fetch('/api/sub-subcategories/csv/template');
      
      if (!response.ok) {
        throw new Error(`Failed to download CSV template: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Sub3 Categories CSV Blob size:', blob.size);
      
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sub3-categories-template.csv';
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      console.log('Download link clicked');
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('Sub3 Categories CSV download cleanup completed');
      }, 1000);
      
    } catch (err) {
      console.error('Sub3 Categories CSV template download error:', err);
      setError('Failed to download CSV template. Please try again.');
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
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
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
      const response = await fetch('/api/sub-subcategories/csv/upload', {
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
    setUploadStep(1);
    setSelectedFile(null);
    setUploadResults(null);
    setError('');
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
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <FiLayers className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sub3 Categories Upload</h1>
              <p className="text-gray-600 mt-1">
                Upload product models organized by hierarchy (Category → Subcategory → Models)
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {['Template', 'Upload', 'Processing', 'Results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  uploadStep > index + 1 
                    ? 'bg-purple-600 text-white' 
                    : uploadStep === index + 1 
                    ? 'bg-purple-100 text-purple-600 border-2 border-purple-600' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {uploadStep > index + 1 ? (
                    <FiCheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 ${
                    uploadStep > index + 1 ? 'bg-purple-600' : 'bg-gray-200'
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
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <FiFile className="text-purple-600" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Download CSV Template
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Download the CSV template to organize product models under subcategories.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-2xl mx-auto mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Template includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>CSV Headers:</strong> Sub-Subcategory Name, Sub-Subcategory Slug, Category Name, Subcategory Name, Description, Image URL, Sort Order, Is Active</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>Sample Data:</strong> iPhone 17, iPhone 16, Samsung Galaxy, iPad Pro, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>Hierarchical Structure:</strong> Category → Subcategory → Models (iPhone 17, iPhone 16, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>Universal Format:</strong> Opens in Excel, Google Sheets, Numbers, or any spreadsheet program</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto mb-6">
                <h3 className="font-medium text-purple-900 mb-2">📱 Example Structure:</h3>
                <div className="bg-white rounded p-3 text-sm">
                  <div className="font-mono text-xs">
                    <div className="grid grid-cols-3 gap-2 mb-2 font-semibold">
                      <div>Category Name</div>
                      <div>Subcategory Name</div>
                      <div>Sub-Subcategory Name</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>Electronics</div>
                      <div>Smartphones</div>
                      <div>iPhone 17</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>Electronics</div>
                      <div>Smartphones</div>
                      <div>iPhone 16</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>Electronics</div>
                      <div>Smartphones</div>
                      <div>Samsung Galaxy</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadTemplate}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
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
                  Upload Your CSV File
                </h2>
                <p className="text-gray-600">
                  Drag and drop your filled CSV template or click to browse
                </p>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto text-gray-400 mb-4" size={48} />
                {isDragActive ? (
                  <p className="text-purple-600">Drop the CSV file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported format: .csv (Max file size: 10MB)
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
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setError('');
                      }}
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
                    <FiAlertCircle className="text-red-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-medium text-red-900">Upload Error</h3>
                      <p className="text-red-800 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isProcessing}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2" />
                      Upload & Process
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {uploadStep === 3 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FiLoader className="animate-spin text-purple-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Your CSV File
              </h2>
              <p className="text-gray-600">
                Please wait while we process and validate your sub3 categories...
              </p>
            </div>
          )}

          {/* Step 4: Results */}
          {uploadStep === 4 && uploadResults && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  uploadResults.errors.length > 0 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {uploadResults.errors.length > 0 ? (
                    <FiAlertCircle className="text-yellow-600" size={32} />
                  ) : (
                    <FiCheckCircle className="text-green-600" size={32} />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload {uploadResults.errors.length > 0 ? 'Completed with Warnings' : 'Successful'}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  {uploadResults.totalCreated} sub3 categories created successfully
                  {uploadResults.errors.length > 0 && ` with ${uploadResults.errors.length} warnings`}
                </p>
              </div>

              {/* Results Summary */}
              <div className="bg-gray-50 rounded-lg p-6 text-left max-w-2xl mx-auto mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Upload Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiCheckCircle className="text-green-600 mr-3" size={24} />
                      <div>
                        <p className="text-2xl font-bold text-green-900">{uploadResults.totalCreated}</p>
                        <p className="text-sm text-green-800">Models Created</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiAlertCircle className="text-yellow-600 mr-3" size={24} />
                      <div>
                        <p className="text-2xl font-bold text-yellow-900">{uploadResults.errors.length}</p>
                        <p className="text-sm text-yellow-800">Warnings/Errors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {uploadResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto mb-6">
                  <h3 className="font-medium text-red-900 mb-2">Error Details:</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {uploadResults.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-sm text-red-800 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {error}
                      </div>
                    ))}
                    {uploadResults.errors.length > 10 && (
                      <p className="text-sm text-red-700 font-medium">
                        ... and {uploadResults.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={resetUpload}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
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

export default Sub3CategoriesUpload;
