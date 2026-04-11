import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

const AuthDebugPage = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthState = () => {
      try {
        console.log('Auth Debug - Checking authentication state...');
        
        let authContext;
        try {
          authContext = useSupabaseAuth();
          console.log('Auth Debug - Auth context loaded successfully');
        } catch (contextError) {
          console.error('Auth Debug - Context error:', contextError);
          setError('Failed to load authentication context: ' + contextError.message);
          return;
        }

        const { user, profile, loading, initializing, isAuthenticated } = authContext;
        
        const authenticated = isAuthenticated();
        console.log('Auth Debug - isAuthenticated():', authenticated);
        console.log('Auth Debug - user:', user);
        console.log('Auth Debug - profile:', profile);
        console.log('Auth Debug - loading:', loading);
        console.log('Auth Debug - initializing:', initializing);

        setDebugInfo({
          isAuthenticated: authenticated,
          user: user ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            user_metadata: user.user_metadata
          } : null,
          profile: profile ? {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone
          } : null,
          loading,
          initializing,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Auth Debug - Error:', error);
        setError('Debug error: ' + error.message);
      }
    };

    checkAuthState();
  }, []);

  if (error) {
    return (
      <Layout title="Auth Debug Error">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Debug Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Authentication Debug">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug</h1>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Is Authenticated:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    debugInfo.isAuthenticated 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo.isAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Loading:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    debugInfo.loading 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {debugInfo.loading ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Initializing:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    debugInfo.initializing 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {debugInfo.initializing ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Timestamp:</span>
                  <span className="text-gray-600">{debugInfo.timestamp}</span>
                </div>
              </div>
            </div>

            {debugInfo.user && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">User ID:</span>
                    <span className="text-gray-600">{debugInfo.user.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-600">{debugInfo.user.email}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Created:</span>
                    <span className="text-gray-600">{new Date(debugInfo.user.created_at).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-gray-600">{debugInfo.user.user_metadata?.name || 'Not set'}</span>
                  </div>
                </div>
              </div>
            )}

            {debugInfo.profile && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Profile ID:</span>
                    <span className="text-gray-600">{debugInfo.profile.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-gray-600">{debugInfo.profile.name || 'Not set'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-600">{debugInfo.profile.email}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="text-gray-600">{debugInfo.profile.phone || 'Not set'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Go to Checkout
                </button>
                
                <button
                  onClick={() => window.location.href = '/cart'}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Cart
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Refresh Auth Debug
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Full Debug Data</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthDebugPage;
