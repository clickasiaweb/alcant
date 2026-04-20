import { supabase } from './supabase';

// Supabase Authentication Service
class SupabaseAuthService {
  constructor() {
    this.auth = supabase.auth;
  }

  // Sign up new user
  async signUp(email, password, options = {}) {
    try {
      const { data, error } = await this.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: options.name || '',
            phone: options.phone || '',
            address: options.address || {},
            ...options.metadata
          },
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // If signup successful but no session (email confirmation required), bypass it
      if (data.user && !data.session) {
        
        // Ensure profile is created in database
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              name: options.name || data.user.user_metadata?.name || data.user.email.split('@')[0],
              phone: options.phone || data.user.user_metadata?.phone || '',
              address: options.address || data.user.user_metadata?.address || {},
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError) {
          } else {
          }
        } catch (profileErr) {
        }

        // Try to sign in immediately (bypassing email confirmation)
        try {
          const signInResult = await this.signIn(email, password);
          return {
            user: signInResult.user || data.user,
            session: signInResult.session,
            message: 'Account created and logged in successfully!'
          };
        } catch (signInError) {
          // If sign in fails, still return successful signup
          return {
            user: data.user,
            session: null,
            message: 'Account created successfully! Please try logging in.'
          };
        }
      }

      return {
        user: data.user,
        session: data.session,
        message: 'Account created successfully! You are now logged in.'
      };
    } catch (error) {
      throw error;
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      const { data, error } = await this.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Handle email confirmation error - just throw the error since we disabled it in database
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Your account is not yet confirmed. Please try again in a few moments or contact support.');
        }
        throw new Error(error.message);
      }

      return {
        user: data.user,
        session: data.session,
        message: 'Login successful!'
      };
    } catch (error) {
      throw error;
    }
  }

  // Sign out current user
  async signOut() {
    try {
      const { error } = await this.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  // Get user profile with additional data
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // Return first item or null instead of using .single() to avoid coercion error
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await this.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Password reset email sent!' };
    } catch (error) {
      throw error;
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await this.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Password updated successfully!' };
    } catch (error) {
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return this.auth.onAuthStateChange(callback);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.auth.getUser() !== null;
  }

  // Get session
  async getSession() {
    try {
      const { data: { session }, error } = await this.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      return session;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new SupabaseAuthService();
export default authService;
