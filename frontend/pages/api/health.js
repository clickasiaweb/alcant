// Vercel serverless function for health check
import { supabase } from 'lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    const dbStatus = error ? 'disconnected' : 'connected';

    res.status(200).json({
      status: "Server is running",
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Health check failed',
      details: error.message
    });
  }
}
