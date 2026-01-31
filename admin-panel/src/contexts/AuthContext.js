import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && !error) {
          // Get user profile from our users table
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          if (profile && !profileError) {
            setUser({
              ...session.user,
              role: profile.role,
              id: profile.id
            });
          }
        }
      } catch (error) {
        console.error("Error getting session:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session) {
            // Get user profile from our users table
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();
            
            if (profile && !profileError) {
              setUser({
                ...session.user,
                role: profile.role,
                id: profile.id
              });
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error in auth state change:", error.message);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing:", error.message);
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile not found. Please contact administrator.');
      }

      if (profile.role !== 'admin') {
        throw new Error('Access denied. Admin access required.');
      }

      return {
        user: {
          ...data.user,
          role: profile.role,
          id: profile.id
        },
        session: data.session
      };
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in.');
        }
        throw authError;
      }

      // Then create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
          email,
          name,
          role: 'user', // Default role, admin needs to upgrade
          is_active: true
        }])
        .select()
        .single();

      if (profileError) {
        // If profile creation fails, try to clean up the auth user
        if (authData.user) {
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError.message);
          }
        }
        throw new Error('Failed to create user profile. Please try again.');
      }

      return {
        user: {
          ...authData.user,
          role: profile.role,
          id: profile.id
        },
        session: authData.session
      };
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
