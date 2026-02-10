const { supabase, supabaseService } = require('../config/supabase');

class SupabaseSubSubCategory {
  static async find(query = {}, options = {}) {
    let supabaseQuery = supabase.from('sub_subcategories').select('*', { count: 'exact' });
    
    // Apply filters
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }
    
    if (query.subCategoryId) {
      supabaseQuery = supabaseQuery.eq('subcategory_id', query.subCategoryId);
    }
    
    // Apply sorting
    if (options.sort) {
      Object.entries(options.sort).forEach(([field, direction]) => {
        if (direction === 1 || direction === -1) {
          const order = direction === 1 ? 'asc' : 'desc';
          supabaseQuery = supabaseQuery.order(field, { ascending: order === 'asc' });
        }
      });
    } else {
      supabaseQuery = supabaseQuery.order('name', { ascending: true });
    }
    
    // Apply pagination
    if (options.skip) {
      supabaseQuery = supabaseQuery.range(options.skip, options.skip + (options.limit || 24) - 1);
    } else if (options.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit);
    }
    
    const { data, error, count } = await supabaseQuery;
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0
    };
  }
  
  static async findOne(query) {
    let supabaseQuery = supabase.from('sub_subcategories').select('*').limit(1);
    
    if (query.slug) {
      supabaseQuery = supabaseQuery.eq('slug', query.slug);
    }
    
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] : null;
  }
  
  static async findById(id) {
    const { data, error } = await supabase
      .from('sub_subcategories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  static async create(subSubCategoryData) {
    // Generate slug if not provided
    if (!subSubCategoryData.slug) {
      subSubCategoryData.slug = subSubCategoryData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
    
    // Convert field names to match database schema
    const dbData = {
      name: subSubCategoryData.name,
      slug: subSubCategoryData.slug,
      subcategory_id: subSubCategoryData.subcategory_id,
      description: subSubCategoryData.description || null,
      sort_order: subSubCategoryData.sort_order || 0,
      is_active: subSubCategoryData.is_active !== undefined ? subSubCategoryData.is_active : true
    };
    
    const { data, error } = await supabaseService
      .from('sub_subcategories')
      .insert([dbData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  static async findByIdAndUpdate(id, updateData) {
    // Convert field names to match database schema
    const dbData = {};
    if (updateData.name !== undefined) dbData.name = updateData.name;
    if (updateData.slug !== undefined) dbData.slug = updateData.slug;
    if (updateData.description !== undefined) dbData.description = updateData.description;
    if (updateData.is_active !== undefined) dbData.is_active = updateData.is_active;
    
    // Update timestamp
    dbData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabaseService
      .from('sub_subcategories')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('sub_subcategories').select('*', { count: 'exact', head: true });
    
    // Apply filters
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }
    
    if (query.is_active !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.is_active);
    }
    
    if (query.subcategory_id) {
      supabaseQuery = supabaseQuery.eq('subcategory_id', query.subcategory_id);
    }
    
    const { count, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return count || 0;
  }
  
  static async getHierarchy(categorySlug = 'iphone-cases') {
    const { data, error } = await supabase
      .from('iphone_categories_hierarchy')
      .select('*')
      .eq('category_slug', categorySlug);
    
    if (error) throw error;
    
    return data || [];
  }
  
  static async lean() {
    // Supabase queries are already lean by default
    return this;
  }
}

module.exports = SupabaseSubSubCategory;
