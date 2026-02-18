const { createClient } = require("@supabase/supabase-js");

/**
 * Simplified Supabase configuration for Vercel deployment
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration");
  console.error("SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
  console.error("SUPABASE_ANON_KEY:", supabaseKey ? "SET" : "MISSING");
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error) {
      console.error("❌ Supabase connection failed:", error);
      return { success: false, error: error.message };
    }
    console.log("✅ Supabase connection successful");
    return { success: true, data };
  } catch (error) {
    console.error("❌ Supabase connection error:", error);
    return { success: false, error: error.message };
  }
};

// Get connection status
const getConnectionStatus = () => {
  return {
    connected: !!(supabaseUrl && supabaseKey),
    url: supabaseUrl,
    hasCredentials: !!(supabaseKey)
  };
};

module.exports = {
  supabase,
  testConnection,
  getConnectionStatus
};
