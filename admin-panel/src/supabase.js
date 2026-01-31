import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

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
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.order) {
      query = query.order(filters.order.column, { ascending: filters.order.ascending })
    }
    
    const { data, error } = await query
    return { data, error }
  },

  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert([productData])
      .select()
      .single()
    return { data, error }
  },

  updateProduct: async (id, updates) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('id', id)
    return { error }
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

  createCategory: async (categoryData) => {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .insert([categoryData])
      .select()
      .single()
    return { data, error }
  },

  // Users
  getUsers: async () => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Inquiries
  getInquiries: async () => {
    const { data, error } = await supabase
      .from(TABLES.INQUIRIES)
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  updateInquiryStatus: async (id, status) => {
    const { data, error } = await supabase
      .from(TABLES.INQUIRIES)
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

export default supabase
