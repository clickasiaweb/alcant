const { createClient } = require('@supabase/supabase-js');

/**
 * Supabase database connection and configuration
 */
class SupabaseClient {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    // Client for general operations
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    
    // Service client for admin operations
    this.serviceClient = createClient(this.supabaseUrl, this.supabaseServiceKey);
  }

  /**
   * Get the Supabase client
   */
  getClient() {
    return this.client;
  }

  /**
   * Get the Supabase service client (for admin operations)
   */
  getServiceClient() {
    return this.serviceClient;
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('products')
        .select('count')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      return { success: true, message: 'Supabase connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      connected: !!this.supabaseUrl && !!this.supabaseKey,
      url: this.supabaseUrl ? this.supabaseUrl.replace(/https:\/\/([^\.]+)\..*/, 'https://$$.***') : null,
      client: 'supabase'
    };
  }
}

// Create singleton instance
const supabaseClient = new SupabaseClient();

module.exports = {
  supabase: supabaseClient.getClient(),
  supabaseService: supabaseClient.getServiceClient(),
  testConnection: () => supabaseClient.testConnection(),
  getConnectionStatus: () => supabaseClient.getConnectionStatus()
};
