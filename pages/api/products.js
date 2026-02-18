// Vercel serverless function for products API
import { supabase } from 'lib/supabase';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all products
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return res.status(200).json(data);
        
      case 'POST':
        // Create new product
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert([req.body])
          .select();
        
        if (createError) throw createError;
        return res.status(201).json(newProduct[0]);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
