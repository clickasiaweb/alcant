import { useEffect, useState } from 'react'
import { supabase, supabaseHelpers } from '../lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Loading...')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('products').select('count').limit(1)
        
        if (error) {
          setStatus(`Connection Error: ${error.message}`)
          return
        }
        
        setStatus('✅ Connected to Supabase!')
        
        // Get some sample data
        const { data: productsData } = await supabaseHelpers.getProducts({ limit: 5 })
        const { data: categoriesData } = await supabaseHelpers.getCategories()
        
        setProducts(productsData || [])
        setCategories(categoriesData || [])
        
      } catch (err) {
        setStatus(`Error: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Supabase Connection Test</h1>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: status.includes('✅') ? '#d4edda' : '#f8d7da',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <strong>Status:</strong> {status}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Sample Products ({products.length})</h3>
          {products.map(product => (
            <div key={product.id} style={{ 
              padding: '10px', 
              border: '1px solid #ddd', 
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <strong>{product.name}</strong>
              <br />
              <small>Category: {product.category} | Price: ${product.price}</small>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h3>Categories ({categories.length})</h3>
          {categories.map(category => (
            <div key={category.id} style={{ 
              padding: '10px', 
              border: '1px solid #ddd', 
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <strong>{category.name}</strong>
              <br />
              <small>Slug: {category.slug}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
