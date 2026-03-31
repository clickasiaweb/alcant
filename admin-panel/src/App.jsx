import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import BulkUploadPage from './pages/BulkUploadPage';
import SimpleDownloadTest from './components/SimpleDownloadTest';
import SimpleTest from './pages/SimpleTest';
import InquiriesPage from './pages/InquiriesPage';
import ContentPage from './pages/ContentPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/bulk-upload" element={<BulkUploadPage />} />
          <Route path="/test-download" element={<SimpleDownloadTest />} />
          <Route path="/simple-test" element={<SimpleTest />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/content" element={<ContentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
