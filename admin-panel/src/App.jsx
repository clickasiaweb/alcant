import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import BulkUploadPage from './pages/BulkUploadPage';
import CategoryBulkUpload from './components/CategoryBulkUpload';
import CategoryUpload from './components/CategoryUpload';
import SubcategoryUpload from './components/SubcategoryUpload';
import SubSubcategoryUpload from './components/SubSubcategoryUpload';
import SimpleDownloadTest from './components/SimpleDownloadTest';
import SimpleTest from './pages/SimpleTest';
import CategoriesPage from './pages/CategoriesPage';
import SubCategoriesPage from './pages/SubCategoriesPage';
import SubSubCategoriesPage from './pages/SubSubCategoriesPage';
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
          <Route path="/category-bulk-upload" element={<CategoryBulkUpload />} />
          <Route path="/category-upload" element={<CategoryUpload />} />
          <Route path="/subcategory-upload" element={<SubcategoryUpload />} />
          <Route path="/sub-subcategory-upload" element={<SubSubcategoryUpload />} />
          <Route path="/test-download" element={<SimpleDownloadTest />} />
          <Route path="/simple-test" element={<SimpleTest />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/subcategories" element={<SubCategoriesPage />} />
          <Route path="/sub-subcategories" element={<SubSubCategoriesPage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/content" element={<ContentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
