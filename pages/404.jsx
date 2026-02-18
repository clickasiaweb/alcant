import React from 'react';
import Layout from '../components/Layout';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  FileQuestion,
  RefreshCw,
  Map
} from 'lucide-react';

const Custom404Page = () => {
  const popularPages = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Search },
    { name: 'About Us', href: '/about', icon: FileQuestion },
    { name: 'Contact', href: '/contact', icon: Map }
  ];

  const suggestions = [
    'Check the URL for typos',
    'Try using the search bar',
    'Browse our product categories',
    'Visit our sitemap'
  ];

  return (
    <Layout title="Page Not Found">
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8 md:p-12 text-center">
                {/* 404 Graphic */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-6">
                    <span className="text-6xl font-bold text-gray-400">404</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Oops! The page you're looking for doesn't exist or has been moved. 
                    Don't worry, we'll help you find what you're looking for.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for products, pages, or content..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          window.location.href = `/search?q=${encodeURIComponent(e.target.value)}`;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Popular Pages */}
                <div className="mb-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Pages</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {popularPages.map((page) => (
                      <a
                        key={page.name}
                        href={page.href}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <page.icon className="w-6 h-6 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-700">{page.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mb-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">What You Can Try</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center space-x-3 text-gray-600">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Help Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Still Can't Find What You're Looking For?</h2>
                  <p className="text-gray-600 mb-6">
                    Our customer support team is here to help you find the right products and information.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href="/contact"
                      className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Contact Support
                    </a>
                    <a
                      href="/faq"
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Browse FAQ
                    </a>
                  </div>
                </div>

                {/* Back Button */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => window.history.back()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go Back</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Report Broken Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Found a broken link? Help us improve by reporting it.
              </p>
              <a
                href="/contact"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Report Broken Link
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Custom404Page;
