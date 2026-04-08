// Vercel serverless function for signup
import { supabase } from 'lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, phone } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
          phone: phone || ''
        }
      }
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(201).json({ 
      user: data.user, 
      session: data.session,
      message: 'Account created successfully! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Signup failed' });
  }
}
