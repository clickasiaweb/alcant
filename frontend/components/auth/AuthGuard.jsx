import React from 'react';
import { useRouter } from 'next/router';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';

const AuthGuard = ({ children, fallbackPath = '/login', requireAuth = true }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useSupabaseAuth();

  React.useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated()) {
      router.push(fallbackPath);
    }
  }, [isAuthenticated, loading, requireAuth, fallbackPath, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated()) {
    return children;
  }

  // Show nothing while redirecting
  return null;
};

export default AuthGuard;
