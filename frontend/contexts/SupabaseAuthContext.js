import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/supabaseAuth';

const SupabaseAuthContext = createContext();

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const session = await authService.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch additional profile data
          const profileData = await authService.getUserProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setInitializing(false);
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile data
          const profileData = await authService.getUserProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email, password, options = {}) => {
    setLoading(true);
    try {
      const result = await authService.signUp(email, password, options);
      
      if (result.user) {
        setUser(result.user);
        
        // Fetch profile data
        const profileData = await authService.getUserProfile(result.user.id);
        setProfile(profileData);
      }
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      
      if (result.user) {
        setUser(result.user);
        
        // Fetch profile data
        const profileData = await authService.getUserProfile(result.user.id);
        setProfile(profileData);
      }
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const updatedProfile = await authService.updateProfile(user.id, profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      const result = await authService.resetPassword(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Update password function
  const updatePassword = async (newPassword) => {
    setLoading(true);
    try {
      const result = await authService.updatePassword(newPassword);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return profile?.role === 'admin' || user?.email?.endsWith('@alcant.com');
  };

  const getFullName = () => {
    return profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  const value = {
    // State
    user,
    profile,
    loading,
    initializing,
    
    // Auth methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    
    // Profile methods
    updateProfile,
    
    // Helper methods
    isAuthenticated,
    isAdmin,
    getFullName,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
