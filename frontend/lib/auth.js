// This file is deprecated. Please use supabaseAuth.js instead.
import { authService } from './supabaseAuth';

// Legacy wrapper for backward compatibility
const AuthAPI = {
  async signup(userData) {
    return authService.signUp(userData.email, userData.password, {
      name: userData.name,
      phone: userData.phone
    });
  },

  async login(credentials) {
    return authService.signIn(credentials.email, credentials.password);
  },

  async logout() {
    return authService.signOut();
  },

  async getCurrentUser() {
    return authService.getCurrentUser();
  }
};

export default AuthAPI;
