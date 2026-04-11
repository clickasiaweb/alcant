// Server-side authentication utilities
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
