import React from 'react';

const SimpleDownloadTest = () => {
  const downloadTemplate = async () => {
    console.log('Starting simple download test...');
    
    try {
      // Use window.fetch directly instead of axios
      const response = await fetch('http://localhost:5001/api/bulk-upload/template');
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'product-upload-template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully!');
      alert('Template downloaded successfully!');
      
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Simple Download Test</h2>
      <p>Click the button below to test template download using fetch API directly.</p>
      <button 
        onClick={downloadTemplate}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Download Template (Test)
      </button>
    </div>
  );
};

export default SimpleDownloadTest;
