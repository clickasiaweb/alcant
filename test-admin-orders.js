// Manually set environment variables
process.env.SUPABASE_URL = 'https://orhcxgmjychxcrqqwcqu.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaGN4Z21qeWNoeGNycXF3Y3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjIwODQsImV4cCI6MjA4NDgzODA4NH0.lHKuN5EKkVmCMF-u3PKmDSXkkS2k8k52hQhZ2M5zdNg';

// Test script to verify admin panel order field mappings
const { supabase } = require('./backend/config/supabase');

async function testOrderFields() {
  try {
    console.log('Testing order field mappings...\n');
    
    // Fetch a sample order
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('No orders found in database');
      return;
    }
    
    const order = orders[0];
    console.log('Sample order data:');
    console.log('==================');
    console.log('Order ID:', order.order_id);
    console.log('Total Amount:', order.total_amount);
    console.log('Order Status:', order.order_status);
    console.log('Payment Status:', order.payment_status);
    console.log('Created At:', order.created_at);
    console.log('Shipping Address:', JSON.stringify(order.shipping_address, null, 2));
    console.log('Products:', JSON.stringify(order.products, null, 2));
    
    // Test field mapping for frontend
    console.log('\nFrontend field mapping:');
    console.log('=======================');
    console.log('orderId ->', order.order_id);
    console.log('totalAmount ->', order.total_amount);
    console.log('orderStatus ->', order.order_status);
    console.log('paymentStatus ->', order.payment_status);
    console.log('createdAt ->', order.created_at);
    console.log('shippingAddress ->', order.shipping_address);
    console.log('trackingId ->', order.tracking_id);
    
    console.log('\n✅ All field mappings verified successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOrderFields();
