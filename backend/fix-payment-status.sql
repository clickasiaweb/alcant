-- Fix payment_status check constraint case issue
-- The backend is sending 'paid' but database expects 'Paid'

-- Update the check constraint to be case insensitive
ALTER TABLE orders DROP CONSTRAINT orders_payment_status_check;

-- Add case-insensitive constraint
ALTER TABLE orders 
ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('Pending', 'pending', 'Paid', 'paid', 'Failed', 'failed', 'Refunded', 'refunded'));

-- Also fix order_status constraint to be case insensitive
ALTER TABLE orders DROP CONSTRAINT orders_order_status_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('Pending', 'pending', 'Confirmed', 'confirmed', 'Processing', 'processing', 'Shipped', 'shipped', 'Out for Delivery', 'out for delivery', 'Delivered', 'delivered', 'Cancelled', 'cancelled'));
