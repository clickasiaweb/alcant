// Vercel serverless function for categories API
import { supabase } from '../../../lib/supabase.js';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all categories
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return res.status(200).json(data);
        
      case 'POST':
        // Create new category
        const { data: newCategory, error: createError } = await supabase
          .from('categories')
          .insert([req.body])
          .select();
        
        if (createError) throw createError;
        return res.status(201).json(newCategory[0]);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Categories API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
