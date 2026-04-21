// Check database status and test order creation
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fkjqbzfpwtoqgptygupl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJ5cCI6ImlhdXRocm5zIjoxLCJzdWIiOiJmMGJmNjE3MS1hZDQ5MzBmZCIsImV4ZWJiOjE3LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Checking database status...');
    
    // Check if we can read from orders table
    const { data: orders, error: readError } = await supabase
      .from('orders')
      .select('order_id, order_number, created_at')
      .limit(5);
    
    if (readError) {
      console.error('❌ Cannot read orders table:', readError.message);
      return;
    }
    
    console.log('✅ Orders table accessible');
    console.log('📊 Recent orders:', orders);
    
    // Test creating a simple order
    console.log('\n🧪 Testing order creation...');
    
    const testOrder = {
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
      payment_status: 'paid',
      payment_method: 'Credit Card',
      payment_details: { paidAt: new Date().toISOString(), transactionId: 'TXN123' },
      order_status: 'pending',
      status_history: [{
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Test order',
        updatedBy: 'system'
      }]
    };
    
    const { data: newOrder, error: insertError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();
    
    if (insertError) {
      console.error('❌ Order creation failed:', insertError.message);
      console.error('📋 Full error details:', insertError);
      
      // Check if it's a specific constraint issue
      if (insertError.message.includes('order_number')) {
        console.log('🔧 Order number constraint issue detected');
        console.log('💡 Trying without order_number...');
        
        // Try without order_number
        const { data: orderWithoutNumber, error: noNumberError } = await supabase
          .from('orders')
          .insert({
            ...testOrder,
            order_number: undefined
          })
          .select();
        
        if (noNumberError) {
          console.error('❌ Still failed without order_number:', noNumberError.message);
        } else {
          console.log('✅ Order created without order_number!');
          console.log('📋 Order ID:', orderWithoutNumber[0].order_id);
          
          // Clean up
          await supabase
            .from('orders')
            .delete()
            .eq('order_id', orderWithoutNumber[0].order_id);
        }
      }
    } else {
      console.log('✅ Test order created successfully!');
      console.log('📋 Order ID:', newOrder[0].order_id);
      console.log('📋 Order Number:', newOrder[0].order_number);
      
      // Clean up test order
      await supabase
        .from('orders')
        .delete()
        .eq('order_id', newOrder[0].order_id);
      
      console.log('🧹 Test order cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkDatabaseStatus();
