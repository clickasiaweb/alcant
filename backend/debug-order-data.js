// Debug script to check what data is actually being sent to Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fkjqbzfpwtoqgptygupl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugOrderData() {
  try {
    console.log('🔍 Debugging what Supabase receives...');
    
    const testOrderData = {
      order_id: `TEST${Date.now()}`,
      order_number: `TEST-ORD${Date.now()}`,
      products: [{
        id: 'test-product',
        name: 'Test Product',
        price: 1000,
        quantity: 1,
        image: '/images/products/default.jpg',
        variant: { color: 'Red', size: 'M' }
      }],
      subtotal: 1000,
      tax: 180,
      shipping: 0,
      discount: 0,
      total_amount: 1180,
      shipping_address: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+919876543210',
        address: '123 Test St',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      payment_status: 'Paid',
      payment_method: 'Credit Card',
      payment_details: { paidAt: new Date().toISOString(), transactionId: 'TXN123' },
      order_status: 'Pending',
      status_history: [{
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Test order',
        updatedBy: 'system'
      }]
    };

    console.log('📤 Sending orderData:', JSON.stringify(testOrderData, null, 2));

    const { data, error } = await supabase
      .from('orders')
      .insert(testOrderData)
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      console.error('📋 Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Order created successfully!');
      console.log('📋 Order data:', data[0]);
      
      // Clean up
      await supabase
        .from('orders')
        .delete()
        .eq('order_id', data[0].order_id);
      
      console.log('🧹 Test order cleaned up');
    }

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugOrderData();
