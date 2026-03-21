import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import BulkUploadPage from './pages/BulkUploadPage';
import CategoryUpload from './components/CategoryUpload';
import SubcategoryUpload from './components/SubcategoryUpload';
import SubSubcategoryUpload from './components/SubSubcategoryUpload';
import Sub3CategoriesUpload from './components/Sub3CategoriesUpload';
import SimpleDownloadTest from './components/SimpleDownloadTest';
import SimpleTest from './pages/SimpleTest';
import CategoriesPage from './pages/CategoriesPage';
import SubCategoriesPage from './pages/SubCategoriesPage';
import SubSubCategoriesPage from './pages/SubSubCategoriesPage';
import Sub3CategoriesPage from './pages/Sub3CategoriesPage';
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
          <Route path="/category-upload" element={<CategoryUpload />} />
          <Route path="/subcategory-upload" element={<SubcategoryUpload />} />
          <Route path="/sub-subcategory-upload" element={<SubSubcategoryUpload />} />
          <Route path="/sub3-categories-upload" element={<Sub3CategoriesUpload />} />
          <Route path="/test-download" element={<SimpleDownloadTest />} />
          <Route path="/simple-test" element={<SimpleTest />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/subcategories" element={<SubCategoriesPage />} />
          <Route path="/sub-subcategories" element={<SubSubCategoriesPage />} />
          <Route path="/sub3-categories" element={<Sub3CategoriesPage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/content" element={<ContentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
