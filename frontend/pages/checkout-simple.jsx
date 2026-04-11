import React from 'react';
import Layout from '../components/Layout';

const SimpleCheckoutPage = () => {
  return (
    <Layout title="Simple Checkout">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Simple Checkout Page</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Checkout Information</h2>
              <p className="text-gray-600 mb-4">
                This is a simple checkout page to test if the basic routing and layout work.
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Test Information</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Page loaded successfully</li>
                    <li>Layout component working</li>
                    <li>Basic rendering functioning</li>
                  </ul>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => window.location.href = '/checkout'}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Go to Full Checkout
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimpleCheckoutPage;
