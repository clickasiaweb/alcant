// This file is deprecated. Please use SupabaseAuthContext.js instead.
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Handle SSR fallback for SupabaseAuth
  let supabaseAuth;
  try {
    supabaseAuth = useSupabaseAuth();
  } catch (error) {
    // Fallback for SSR when context is not available
    supabaseAuth = {
      user: null,
      loading: false,
      signOut: async () => {},
      isAuthenticated: () => false,
      isAdmin: () => false
    };
  }
  
  // Legacy wrapper for backward compatibility
  const login = async (token, userData) => {
    console.warn('Using legacy login method. Consider migrating to SupabaseAuthContext.');
    // For backward compatibility, we'll store the data but it won't be used
    localStorage.setItem('legacy_token', token);
    localStorage.setItem('legacy_user', JSON.stringify(userData));
  };

  const logout = async () => {
    console.warn('Using legacy logout method. Consider migrating to SupabaseAuthContext.');
    // Clear legacy data
    localStorage.removeItem('legacy_token');
    localStorage.removeItem('legacy_user');
    // Also call Supabase logout
    await supabaseAuth.signOut();
  };

  const isAuthenticated = () => {
    return supabaseAuth.isAuthenticated();
  };

  const isAdmin = () => {
    return supabaseAuth.isAdmin();
  };

  const value = {
    user: supabaseAuth.user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading: supabaseAuth.loading,
    // Expose Supabase methods for migration
    ...supabaseAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
