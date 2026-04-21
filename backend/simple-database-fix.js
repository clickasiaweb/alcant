// Simple script to provide SQL for fixing the database
console.log('🔧 Database Fix Required');
console.log('');
console.log('The production database is missing the "order_number" column.');
console.log('');
console.log('📝 Please run this SQL in your Supabase SQL Editor:');
console.log('');
console.log('-- Add order_number column');
console.log('ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);');
console.log('');
console.log('-- Update existing records');
console.log('UPDATE orders SET order_number = order_id WHERE order_number IS NULL OR order_number = \'\';');
console.log('');
console.log('-- Add unique constraint');
console.log('ALTER TABLE orders ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);');
console.log('');
console.log('✅ After running this SQL, order placement should work!');
console.log('');
console.log('🧪 You can test the fix by running: node test-production-api.js');
