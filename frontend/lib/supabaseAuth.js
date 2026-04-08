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
            ...options.metadata
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        user: data.user,
        session: data.session,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Signup error:', error);
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
        throw new Error(error.message);
      }

      return {
        user: data.user,
        session: data.session,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Signin error:', error);
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
      console.error('Signout error:', error);
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
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get user profile with additional data
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
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
      console.error('Update profile error:', error);
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
      console.error('Reset password error:', error);
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
      console.error('Update password error:', error);
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
      console.error('Get session error:', error);
      return null;
    }
  }
}

export const authService = new SupabaseAuthService();
export default authService;
