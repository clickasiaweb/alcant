const { supabase, supabaseService } = require('../config/supabase');

class SupabaseContent {
  static async find(query = {}) {
    let supabaseQuery = supabase.from('content').select('*', { count: 'exact' });
    
    // Apply filters
    if (query.pageKey) {
      supabaseQuery = supabaseQuery.eq('page_key', query.pageKey);
    }
    
    const { data, error, count } = await supabaseQuery;
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0
    };
  }
  
  static async findOne(query) {
    let supabaseQuery = supabase.from('content').select('*').limit(1);
    
    if (query.pageKey) {
      supabaseQuery = supabaseQuery.eq('page_key', query.pageKey);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] : null;
  }
  
  static async create(contentData) {
    // Convert field names to match database schema
    const dbData = {
      page_key: contentData.pageKey,
      title: contentData.title || '',
      subtitle: contentData.subtitle || '',
      content: contentData.content || '',
      button_text: contentData.buttonText || '',
      button_link: contentData.buttonLink || '',
      background_image: contentData.backgroundImage || '',
      image_url: contentData.imageUrl || '',
      video_url: contentData.videoUrl || '',
      video_file: contentData.videoFile || '',
      items: contentData.items || [],
      sections: contentData.sections || [],
      metadata: contentData.metadata || {},
      banner_image: contentData.bannerImage || '',
      is_published: contentData.isPublished !== undefined ? contentData.isPublished : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseService
      .from('content')
      .insert([dbData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  static async findByIdAndUpdate(pageKey, updateData) {
    // Convert field names to match database schema
    const dbData = {};
    if (updateData.title !== undefined) dbData.title = updateData.title;
    if (updateData.subtitle !== undefined) dbData.subtitle = updateData.subtitle;
    if (updateData.content !== undefined) dbData.content = updateData.content;
    if (updateData.buttonText !== undefined) dbData.button_text = updateData.buttonText;
    if (updateData.buttonLink !== undefined) dbData.button_link = updateData.buttonLink;
    if (updateData.backgroundImage !== undefined) dbData.background_image = updateData.backgroundImage;
    if (updateData.imageUrl !== undefined) dbData.image_url = updateData.imageUrl;
    if (updateData.videoUrl !== undefined) dbData.video_url = updateData.videoUrl;
    if (updateData.videoFile !== undefined) dbData.video_file = updateData.videoFile;
    if (updateData.items !== undefined) dbData.items = updateData.items;
    if (updateData.sections !== undefined) dbData.sections = updateData.sections;
    if (updateData.metadata !== undefined) dbData.metadata = updateData.metadata;
    if (updateData.bannerImage !== undefined) dbData.banner_image = updateData.bannerImage;
    if (updateData.isPublished !== undefined) dbData.is_published = updateData.isPublished;
    
    // Update timestamp
    dbData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabaseService
      .from('content')
      .update(dbData)
      .eq('page_key', pageKey)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  static async findOneAndUpdate(pageKey, updateData) {
    return this.findByIdAndUpdate(pageKey, updateData);
  }
}

module.exports = SupabaseContent;
