const { supabase, supabaseService } = require('../config/supabase');

class SupabaseProduct {
  static async find(query = {}, options = {}) {
    let supabaseQuery = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply filters
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }
    if (query.is_active !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.is_active);
    }
    
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }
    
    if (query.subcategory) {
      supabaseQuery = supabaseQuery.eq('subcategory', query.subcategory);
    }
    
    if (query.subcategoryId) {
      supabaseQuery = supabaseQuery.eq('subcategory_id', query.subcategoryId);
    }
    
    if (query.sub_subcategory) {
      supabaseQuery = supabaseQuery.eq('sub_subcategory', query.sub_subcategory);
    }
    
    if (query.sub_subcategory_id) {
      supabaseQuery = supabaseQuery.eq('sub_subcategory_id', query.sub_subcategory_id);
    }
    
    if (query._id) {
      if (query._id.$nin) {
        supabaseQuery = supabaseQuery.not('id', 'in', `(${query._id.$nin.join(',')})`);
      }
    }
    
    if (query.$or) {
      // Handle text search
      const searchTerm = query.$or[0].name.$regex;
      supabaseQuery = supabaseQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%,sub_subcategory.ilike.%${searchTerm}%`);
    }
    
    if (query.price) {
      if (query.price.$gte) supabaseQuery = supabaseQuery.gte('price', query.price.$gte);
      if (query.price.$lte) supabaseQuery = supabaseQuery.lte('price', query.price.$lte);
    }
    
    if (query.isNew !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_new', query.isNew);
    }
    
    if (query.isLimitedEdition !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_limited_edition', query.isLimitedEdition);
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
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
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
    let supabaseQuery = supabase.from('products').select('*').limit(1);
    
    if (query.slug) {
      supabaseQuery = supabaseQuery.eq('slug', query.slug);
    }
    
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }
    if (query.is_active !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.is_active);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] : null;
  }
  
  static async findById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  static async create(productData) {
    console.log('🔧 SupabaseProduct.create called with:', JSON.stringify(productData, null, 2));
    
    // Generate slug if not provided - use same logic as frontend
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace multiple spaces with single hyphen
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }
    
    // Convert field names to match database schema
    const dbData = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description || null,
      price: productData.price || 0,
      old_price: productData.old_price || productData.oldPrice || null,
      final_price: productData.final_price || productData.finalPrice || productData.price || 0,
      category: productData.category || null,
      subcategory: productData.subcategory || null,
      sub_subcategory: productData.sub_subcategory || null, // ✅ Add missing field (text)
      sub_subcategory_id: productData.sub_subcategory_id || null, // ✅ Add missing field (UUID)
      images: productData.images || [],
      image: productData.image || null,
      rating: productData.rating || 0,
      reviews: productData.reviews || 0,
      stock: productData.stock || 0,
      is_new: productData.is_new || productData.isNew || false,
      is_limited_edition: productData.is_limited_edition || productData.isLimitedEdition || false,
      is_blue_monday_sale: productData.is_blue_monday_sale || productData.isBlueMondaySale || false,
      is_active: productData.is_active !== undefined ? productData.is_active : (productData.isActive !== undefined ? productData.isActive : true)
    };
    
    console.log('🚀 SupabaseProduct dbData:', JSON.stringify(dbData, null, 2));
    
    const { data, error } = await supabaseService
      .from('products')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase insert error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: 'This may be due to missing database columns. Run the migration in Supabase dashboard.'
      });
      throw error;
    }
    
    console.log('✅ SupabaseProduct created successfully:', data);
    return data;
  }
  
  static async findByIdAndUpdate(id, updateData) {
    // Validate UUID format for Supabase
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid product ID: ID must be a string');
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid product ID format: ${id}`);
    }
    
    // Convert field names to match database schema
    const dbData = {};
    
    // Handle basic fields that exist in Supabase schema
    if (updateData.name !== undefined) dbData.name = updateData.name;
    if (updateData.slug !== undefined) dbData.slug = updateData.slug;
    if (updateData.description !== undefined) dbData.description = updateData.description;
    if (updateData.price !== undefined) dbData.price = updateData.price;
    if (updateData.old_price !== undefined) dbData.old_price = updateData.old_price;
    if (updateData.oldPrice !== undefined) dbData.old_price = updateData.oldPrice;
    if (updateData.final_price !== undefined) dbData.final_price = updateData.final_price;
    if (updateData.finalPrice !== undefined) dbData.final_price = updateData.finalPrice;
    if (updateData.category !== undefined) dbData.category = updateData.category;
    if (updateData.subcategory !== undefined) dbData.subcategory = updateData.subcategory;
    if (updateData.sub_subcategory !== undefined) dbData.sub_subcategory = updateData.sub_subcategory;
    if (updateData.sub_subcategory_id !== undefined) dbData.sub_subcategory_id = updateData.sub_subcategory_id;
    if (updateData.subcategory_id !== undefined) dbData.subcategory_id = updateData.subcategory_id;
    if (updateData.images !== undefined) dbData.images = updateData.images;
    if (updateData.image !== undefined) dbData.image = updateData.image;
    if (updateData.rating !== undefined) dbData.rating = updateData.rating;
    if (updateData.reviews !== undefined) dbData.reviews = updateData.reviews;
    if (updateData.stock !== undefined) dbData.stock = updateData.stock;
    
    // Handle boolean fields that exist in Supabase schema
    if (updateData.is_new !== undefined) dbData.is_new = updateData.is_new;
    if (updateData.isNew !== undefined) dbData.is_new = updateData.isNew;
    if (updateData.is_limited_edition !== undefined) dbData.is_limited_edition = updateData.is_limited_edition;
    if (updateData.isLimitedEdition !== undefined) dbData.is_limited_edition = updateData.isLimitedEdition;
    if (updateData.is_blue_monday_sale !== undefined) dbData.is_blue_monday_sale = updateData.is_blue_monday_sale;
    if (updateData.isBlueMondaySale !== undefined) dbData.is_blue_monday_sale = updateData.isBlueMondaySale;
    if (updateData.is_active !== undefined) dbData.is_active = updateData.is_active;
    if (updateData.isActive !== undefined) dbData.is_active = updateData.isActive;
    
    // Handle additional fields that exist in Supabase schema
    if (updateData.brand !== undefined) dbData.brand = updateData.brand;
    if (updateData.short_description !== undefined) dbData.short_description = updateData.short_description;
    if (updateData.weight !== undefined) dbData.weight = updateData.weight;
    
    // ❌ REMOVED: Fields that don't exist in Supabase schema
    // seo_meta_title, seo_meta_description, keywords
    
    // Update timestamp
    dbData.updated_at = new Date().toISOString();
    
    console.log('🔧 SupabaseProduct updating product:', { id, dbData });
    
    const { data, error } = await supabaseService
      .from('products')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }
    
    console.log('✅ Supabase update successful:', data);
    return data;
  }
  
  static async countDocuments(query = {}) {
    let supabaseQuery = supabase.from('products').select('*', { count: 'exact', head: true });
    
    // Apply same filters as find method
    if (query.isActive !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.isActive);
    }
    if (query.is_active !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_active', query.is_active);
    }
    
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }
    
    if (query.subcategory) {
      supabaseQuery = supabaseQuery.eq('subcategory', query.subcategory);
    }
    
    if (query.sub_subcategory) {
      supabaseQuery = supabaseQuery.eq('sub_subcategory', query.sub_subcategory);
    }
    
    if (query.sub_subcategory_id) {
      supabaseQuery = supabaseQuery.eq('sub_subcategory_id', query.sub_subcategory_id);
    }
    
    if (query.$or) {
      const searchTerm = query.$or[0].name.$regex;
      supabaseQuery = supabaseQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%,sub_subcategory.ilike.%${searchTerm}%`);
    }
    
    if (query.price) {
      if (query.price.$gte) supabaseQuery = supabaseQuery.gte('price', query.price.$gte);
      if (query.price.$lte) supabaseQuery = supabaseQuery.lte('price', query.price.$lte);
    }
    
    if (query._id) {
      if (query._id.$nin) {
        supabaseQuery = supabaseQuery.not('id', 'in', `(${query._id.$nin.join(',')})`);
      }
    }
    
    const { count, error } = await supabaseQuery;
    
    if (error) throw error;
    
    return count || 0;
  }
  
  static async aggregate(pipeline) {
    // Handle aggregation for categories
    if (pipeline.length === 2 && 
        pipeline[0].$match && 
        pipeline[1].$group && 
        pipeline[1].$group._id === '$category') {
      
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const categoryMap = {};
      data.forEach(product => {
        categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
      });
      
      return Object.entries(categoryMap).map(([category, count]) => ({
        _id: category,
        count
      }));
    }
    
    return [];
  }
  
  static async lean() {
    // Supabase queries are already lean by default
    return this;
  }
}

module.exports = SupabaseProduct;
