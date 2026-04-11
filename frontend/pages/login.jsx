import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';

const LoginPage = () => {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center relative">
            <button
              onClick={handleGoHome}
              className="absolute -top-8 right-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to ΛʟcΛɴᴛ
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account or create a new one
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* Login Form */}
              {showLogin && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sign In</h3>
                  <LoginModal
                    isOpen={showLogin}
                    onClose={handleCloseLogin}
                    onSwitchToSignup={handleSwitchToSignup}
                    redirectTo="/account"
                  />
                </div>
              )}

              {/* Signup Form */}
              {showSignup && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create Account</h3>
                  <SignupModal
                    isOpen={showSignup}
                    onClose={handleCloseSignup}
                    onSwitchToLogin={handleSwitchToLogin}
                    redirectTo="/account"
                  />
                </div>
              )}

              {/* Login/Signup Toggle */}
              {!showSignup && (
                <div className="text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={handleSwitchToSignup}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              )}
              
              {showSignup && (
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={handleSwitchToLogin}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}
            </div>

            {/* Alternative Actions */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
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

        {/* Signup Modal */}
        <SignupModal
          isOpen={showSignup}
          onClose={handleCloseSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </Layout>
  );
};

export default LoginPage;
