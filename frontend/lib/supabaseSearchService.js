import { supabase } from './supabase';

// Supabase Search History Service
class SupabaseSearchService {
  constructor() {
    this.tableName = 'search_history';
  }

  // Add search query to history
  async addSearchQuery(userId, query, resultsCount = 0) {
    try {
      if (!userId || !query || query.trim().length === 0) {
        return { success: false, message: 'Invalid parameters' };
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          user_id: userId,
          search_query: query.trim(),
          results_count: resultsCount,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Add search query error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get search history for a user
  async getSearchHistory(userId, options = {}) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get search history error:', error);
      throw error;
    }
  }

  // Get popular search queries (across all users or for a specific user)
  async getPopularSearches(userId = null, limit = 10) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('search_query, count')
        .order('count', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get popular searches error:', error);
      throw error;
    }
  }

  // Clear search history for a user
  async clearSearchHistory(userId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Clear search history error:', error);
      throw error;
    }
  }

  // Delete specific search query
  async deleteSearchQuery(userId, searchId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', userId)
        .eq('id', searchId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Delete search query error:', error);
      throw error;
    }
  }

  // Get search suggestions based on user's search history
  async getSearchSuggestions(userId, query, limit = 5) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('search_query')
        .eq('user_id', userId)
        .ilike('search_query', `%${query.trim()}%`)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      // Remove duplicates and return only the search queries
      const uniqueQueries = [...new Set(data?.map(item => item.search_query) || [])];
      return uniqueQueries;
    } catch (error) {
      console.error('Get search suggestions error:', error);
      throw error;
    }
  }

  // Get search statistics for a user
  async getUserSearchStats(userId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('search_query, timestamp, results_count')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const stats = {
        totalSearches: data?.length || 0,
        recentSearches: data?.slice(0, 5) || [],
        topQueries: this.getTopQueries(data || []),
        averageResults: data?.reduce((sum, item) => sum + (item.results_count || 0), 0) / (data?.length || 1) || 0
      };

      return stats;
    } catch (error) {
      console.error('Get user search stats error:', error);
      throw error;
    }
  }

  // Helper method to get top queries
  getTopQueries(searchHistory) {
    const queryCounts = {};
    
    searchHistory.forEach(item => {
      const query = item.search_query.toLowerCase();
      queryCounts[query] = (queryCounts[query] || 0) + 1;
    });

    return Object.entries(queryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }
}

export const searchService = new SupabaseSearchService();
export default searchService;
