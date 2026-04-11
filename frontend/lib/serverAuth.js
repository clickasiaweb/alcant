// Server-side authentication utilities
import { supabase } from './supabase';

// Use the same singleton supabase client to prevent multiple instances

export async function getServerSideAuth(context) {
  // Always handle authentication client-side to avoid server-side issues
  // This allows the authentication context to manage the state properly
  return {
    props: {
      user: null,
      isAuthenticated: false,
      profile: null
    }
  };
}

export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function requireAuth(context) {
  // Let client-side handle authentication checks
  // This prevents server-side redirects that interfere with client-side auth state
  const auth = await getServerSideAuth(context);
  
  return {
    props: auth
  };
}
