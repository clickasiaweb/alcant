import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Login Disabled
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              For testing purposes, login functionality has been disabled.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Login Functionality Disabled
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      The login system has been temporarily disabled for testing. 
                      You can still use all shopping features without logging in:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Browse products</li>
                      <li>Add items to cart</li>
                      <li>Proceed to checkout</li>
                      <li>Place orders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Alternative Actions</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/products"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Browse Products
                </Link>
                
                <Link
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
