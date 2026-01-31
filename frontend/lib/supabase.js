import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  USERS: 'users',
  CONTENT: 'content',
  INQUIRIES: 'inquiries'
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Products
  getProducts: async (filters = {}) => {
    let query = supabase.from(TABLES.PRODUCTS).select('*')
    
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory)
    }
    if (filters.isNew) {
      query = query.eq('is_new', filters.isNew)
    }
    if (filters.isLimitedEdition) {
      query = query.eq('is_limited_edition', filters.isLimitedEdition)
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.order) {
      query = query.order(filters.order.column, { ascending: filters.order.ascending })
    }
    
    const { data, error } = await query
    return { data, error }
  },

  getProductBySlug: async (slug) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    return { data, error }
  },

  getFeaturedProducts: async (limit = 12) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  getNewProducts: async (limit = 12) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('is_active', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  getSaleProducts: async (limit = 12) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('is_active', true)
      .or('old_price.not.is.null,is_blue_monday_sale.eq.true')
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  getLimitedEditionProducts: async (limit = 12) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('is_active', true)
      .eq('is_limited_edition', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // Categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .eq('is_active', true)
      .order('name')
    return { data, error }
  },

  getCategoryStats: async () => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('category')
      .eq('is_active', true)
    
    if (error) return { data: null, error }
    
    // Count products per category
    const categoryMap = {}
    data.forEach(product => {
      categoryMap[product.category] = (categoryMap[product.category] || 0) + 1
    })
    
    return { data: categoryMap, error: null }
  },

  // Content
  getContent: async (page) => {
    const { data, error } = await supabase
      .from(TABLES.CONTENT)
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .single()
    return { data, error }
  },

  // Inquiries
  createInquiry: async (inquiryData) => {
    const { data, error } = await supabase
      .from(TABLES.INQUIRIES)
      .insert([inquiryData])
      .select()
      .single()
    return { data, error }
  }
}

export default supabase
