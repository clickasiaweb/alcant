const { supabase, supabaseService } = require('../config/supabase');

class SupabaseReview {
  static async create(reviewData) {
    console.log('🔧 SupabaseReview.create called with:', JSON.stringify(reviewData, null, 2));
    
    const { data, error } = await supabaseService
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }
    
    console.log('✅ SupabaseReview created successfully:', data);
    return data;
  }

  static async findByProductId(productId, options = {}) {
    let supabaseQuery = supabase
      .from('reviews')
      .select(`
        *,
        user:users(
          id,
          name,
          email
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    // Apply pagination if specified
    if (options.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit);
    }
    
    if (options.offset) {
      supabaseQuery = supabaseQuery.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return data || [];
  }

  static async calculateAverageRating(productId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        average_rating: 0,
        review_count: 0
      };
    }
    
    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / data.length;
    
    return {
      average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      review_count: data.length
    };
  }

  static async updateProductRating(productId) {
    // Calculate new average rating and review count
    const ratingData = await this.calculateAverageRating(productId);
    
    // Update the product table
    const { data, error } = await supabaseService
      .from('products')
      .update({
        average_rating: ratingData.average_rating,
        review_count: ratingData.review_count,
        rating: ratingData.average_rating, // Keep backward compatibility
        reviews: ratingData.review_count  // Keep backward compatibility
      })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }

  static async findByUserId(userId, options = {}) {
    let supabaseQuery = supabase
      .from('reviews')
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          image,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    // Apply pagination if specified
    if (options.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return data || [];
  }

  static async delete(reviewId, userId = null) {
    let supabaseQuery = supabaseService
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    // If userId is provided, ensure user can only delete their own reviews
    if (userId) {
      supabaseQuery = supabaseQuery.eq('user_id', userId);
    }
    
    const { data, error } = await supabaseQuery.select().single();
    
    if (error) throw error;
    
    // Update product rating after review deletion
    if (data && data.product_id) {
      await this.updateProductRating(data.product_id);
    }
    
    return data;
  }

  static async findById(reviewId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(
          id,
          name,
          email
        ),
        product:products(
          id,
          name,
          slug
        )
      `)
      .eq('id', reviewId)
      .single();
    
    if (error) throw error;
    
    return data;
  }
}

module.exports = SupabaseReview;
