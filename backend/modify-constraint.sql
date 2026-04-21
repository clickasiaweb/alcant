-- Modify existing constraints to accept both cases
-- First drop the existing constraints, then recreate with both cases

-- Drop existing payment_status constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;

-- Drop existing order_status constraint  
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;

-- Recreate payment_status constraint with both cases
ALTER TABLE orders 
ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('Pending', 'pending', 'Paid', 'paid', 'Failed', 'failed', 'Refunded', 'refunded'));

-- Recreate order_status constraint with both cases
ALTER TABLE orders 
ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('Pending', 'pending', 'Confirmed', 'confirmed', 'Processing', 'processing', 'Shipped', 'shipped', 'Out for Delivery', 'out for delivery', 'Delivered', 'delivered', 'Cancelled', 'cancelled'));
