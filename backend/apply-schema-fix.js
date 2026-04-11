/**
 * Apply Orders Schema Fix Script
 * This script will apply the missing columns to the orders table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://orhcxgmjychxcrqqwcqu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaGN4Z21qeWNoeGNycXF3Y3F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI2MjA4NCwiZXhwIjoyMDg0ODM4MDg0fQ.W9Jcoob6tYhaANWCSdwMA8TUzVnnE0pl4p3nI9_KBaM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchemaFix() {
  console.log('=== Applying Orders Schema Fix ===');
  
  try {
    // Read the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, 'fix-orders-schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Executing SQL schema fix...');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql_statement: statement });
          
          if (error) {
            // If RPC doesn't exist, try direct SQL execution
            console.log('RPC not available, trying direct execution...');
            
            // For some statements, we need to use the REST API or skip them
            if (statement.includes('CREATE POLICY') || statement.includes('CREATE TRIGGER') || statement.includes('CREATE FUNCTION')) {
              console.log('Skipping advanced SQL statement (requires admin access):', statement.substring(0, 50) + '...');
              continue;
            }
            
            // Try basic table operations
            if (statement.includes('ALTER TABLE') || statement.includes('CREATE INDEX') || statement.includes('UPDATE') || statement.includes('INSERT')) {
              console.log('This statement may require direct database access. Please apply manually:', statement.substring(0, 100) + '...');
            }
          } else {
            console.log('Statement executed successfully');
          }
        } catch (stmtError) {
          console.log('Statement failed (may require manual execution):', stmtError.message);
        }
      }
    }
    
    console.log('\nSchema fix process completed.');
    console.log('Some statements may require manual execution in Supabase dashboard.');
    
    // Test the orders table structure
    console.log('\n=== Testing Orders Table Structure ===');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.error('Error testing orders table:', ordersError);
    } else {
      console.log('Orders table is accessible');
      if (ordersData.length > 0) {
        console.log('Sample order data:', Object.keys(ordersData[0]));
      }
    }
    
  } catch (error) {
    console.error('Error applying schema fix:', error);
  }
}

// Alternative: Apply key fixes manually
async function applyManualFixes() {
  console.log('=== Applying Manual Schema Fixes ===');
  
  try {
    // Test basic order creation with minimal fields
    const testOrder = {
      order_number: 'TEST' + Date.now(),
      total_amount: 1000,
      shipping_address: { test: 'address' },
      billing_address: { test: 'address' },
      notes: 'Test order'
    };
    
    console.log('Testing minimal order creation...');
    const { data, error } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating test order:', error);
      
      // Try to identify missing columns
      if (error.message.includes('column')) {
        console.log('Missing columns detected. Please run the SQL fix manually.');
      }
    } else {
      console.log('Test order created successfully:', data);
      
      // Clean up test order
      await supabase
        .from('orders')
        .delete()
        .eq('id', data.id);
      
      console.log('Test order cleaned up');
    }
    
  } catch (error) {
    console.error('Error in manual fixes:', error);
  }
}

// Run the fix
applySchemaFix().then(() => {
  console.log('\n=== Schema Fix Complete ===');
  console.log('Please check the Supabase dashboard to ensure all columns were added.');
  console.log('If some columns are missing, manually run the SQL in fix-orders-schema.sql');
}).catch(console.error);
