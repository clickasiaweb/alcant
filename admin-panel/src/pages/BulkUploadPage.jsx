import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiDownload, FiUpload, FiFile, FiCheck, FiX, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BulkUploadPage = () => {
  const [uploadStep, setUploadStep] = useState('idle'); // idle, uploading, parsing, preview, importing, completed
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Download Excel template
  const downloadTemplate = async () => {
    setIsDownloading(true);
    console.log('Starting template download...');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Full URL:', `${API_BASE_URL}/products/bulk-upload/template`);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/products/bulk-upload/template`, {
        responseType: 'blob'
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product-upload-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Template download completed successfully!');
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Error downloading template:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      toast.error('Failed to download template');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      console.log('📁 File uploaded:', uploadedFile);
      console.log('📁 File name:', uploadedFile.name);
      console.log('📁 File size:', uploadedFile.size);
      console.log('📁 File type:', uploadedFile.type);
      console.log('📁 File last modified:', uploadedFile.lastModified);
      
      setFile(uploadedFile);
      setParsedData(null);
      setImportResults(null);
      setUploadStep('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  // Parse uploaded file
  const parseFile = async () => {
    if (!file) return;

    setUploadStep('uploading');
    const formData = new FormData();
    formData.append('file', file);

    // Debug: Log FormData contents
    console.log('📤 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
      console.log(`  ${key} name:`, value.name);
      console.log(`  ${key} size:`, value.size);
      console.log(`  ${key} type:`, value.type);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/products/bulk-upload/parse`, formData, {
        // Don't set Content-Type header - let axios set it automatically for FormData
      });

      setParsedData(response.data.data);
      setUploadStep('preview');
      
      if (response.data.data.errors.length > 0) {
        toast.warning(`File parsed with ${response.data.data.errors.length} validation errors`);
      } else {
        toast.success('File parsed successfully!');
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      
      toast.error(error.response?.data?.message || 'Failed to parse file');
      setUploadStep('idle');
    }
  };

  // Import products
  const importProducts = async () => {
    if (!parsedData || parsedData.validProducts === 0) return;

    setUploadStep('importing');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/products/bulk-upload/import`, {
        products: parsedData.products
      });

      setImportResults(response.data.results);
      setUploadStep('completed');
      
      toast.success(`Import completed! ${response.data.results.success.length} products imported successfully`);
    } catch (error) {
      console.error('Error importing products:', error);
      toast.error(error.response?.data?.message || 'Failed to import products');
      setUploadStep('preview');
    }
  };

  // Reset upload
  const resetUpload = () => {
    setFile(null);
    setParsedData(null);
    setImportResults(null);
    setUploadStep('idle');
  };

  // Format validation errors
  const renderValidationErrors = () => {
    if (!parsedData || parsedData.errors.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          <FiAlertCircle className="inline mr-2" />
          Validation Errors ({parsedData.errors.length})
        </h3>
        <div className="max-h-60 overflow-y-auto">
          {parsedData.errors.map((error, index) => (
            <div key={index} className="text-sm text-red-700 mb-1">
              Row {error.row} - {error.field}: {error.message}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Product Upload</h1>
          <p className="mt-2 text-gray-600">
            Upload multiple products at once using an Excel file
          </p>
        </div>

        {/* Step 1: Download Template */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Download Excel Template</h2>
          <p className="text-gray-600 mb-4">
            Start by downloading our Excel template to ensure your data is formatted correctly.
          </p>
          <button
            onClick={downloadTemplate}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isDownloading ? (
              <FiLoader className="animate-spin mr-2" />
            ) : (
              <FiDownload className="mr-2" />
            )}
            {isDownloading ? 'Downloading...' : 'Download Template'}
          </button>
        </div>

        {/* Step 2: Upload File */}
        {uploadStep === 'idle' && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Upload Your Excel File</h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your Excel file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .xlsx, .xls, .csv files (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={parseFile}
                  className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FiUpload className="mr-2" />
                  Parse File
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Preview */}
        {uploadStep === 'preview' && parsedData && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Preview & Validate</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{parsedData.totalRows}</div>
                <div className="text-sm text-blue-800">Total Rows</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{parsedData.validProducts}</div>
                <div className="text-sm text-green-800">Valid Products</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{parsedData.invalidRows}</div>
                <div className="text-sm text-red-800">Invalid Rows</div>
              </div>
            </div>

            {renderValidationErrors()}

            {parsedData.validProducts > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Valid Products Preview</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.products.slice(0, 10).map((product, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.products.length > 10 && (
                    <div className="text-center py-2 text-sm text-gray-500">
                      Showing 10 of {parsedData.products.length} products
                    </div>
                  )}
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={importProducts}
                    disabled={parsedData.validProducts === 0}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <FiCheck className="mr-2" />
                    Import {parsedData.validProducts} Products
                  </button>
                  <button
                    onClick={resetUpload}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Importing */}
        {uploadStep === 'importing' && (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Importing Products...</h2>
            <p className="text-gray-600">Please wait while we import your products to the database.</p>
          </div>
        )}

        {/* Step 5: Completed */}
        {uploadStep === 'completed' && importResults && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center mb-6">
              <FiCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Import Completed!</h2>
              <p className="text-gray-600">
                {importResults.success.length} products imported successfully
                {importResults.errors.length > 0 && `, ${importResults.errors.length} failed`}
              </p>
            </div>

            {importResults.errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Import Errors</h3>
                <div className="max-h-40 overflow-y-auto">
                  {importResults.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 mb-1">
                      {error.product}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={resetUpload}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUploadPage;
