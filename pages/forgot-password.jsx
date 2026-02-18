import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  return (
    <Layout title="Forgot Password" description="Reset your password">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Forgot your password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              No worries! We'll send you reset instructions.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Coming Soon
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Password reset functionality will be available in Phase 2. 
                    For now, please contact support if you need help accessing your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
