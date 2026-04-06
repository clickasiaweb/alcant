// Simple test to isolate the 500 error
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testOrderInsert() {
  try {
    console.log('Testing minimal order insert...');
    
    const minimalOrder = {
      order_id: 'TEST-' + Date.now(),
      user_id: '00000000-0000-0000-0000-000000000000',
      products: JSON.stringify([{
        id: 'test-product',
        name: 'Test Product',
        price: 1000,
        quantity: 1
      }]),
      subtotal: 1000,
      tax: 180,
      shipping: 0,
      discount: 0,
      total_amount: 1180,
      shipping_address: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        phone: '1234567890',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA'
      }),
      payment_method: 'Test',
      payment_details: JSON.stringify({}),
      notes: 'Test order',
      payment_status: 'Pending',
      order_status: 'Pending',
      status_history: JSON.stringify([{
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Test order',
        updatedBy: 'system'
      }])
    };
    
    console.log('Inserting order:', minimalOrder);
    
    const { data, error } = await supabase
      .from('orders')
      .insert(minimalOrder)
      .select()
      .single();
    
    if (error) {
      console.error('Insert failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('Success! Order created:', data);
    }
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testOrderInsert();
