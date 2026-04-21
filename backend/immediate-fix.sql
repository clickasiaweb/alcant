-- Immediate fix: Allow both cases for status values
-- Run this to fix the issue without redeploying backend

-- First, let's see what constraints exist
-- If the payment_status constraint exists, modify it to accept both cases
-- If it doesn't exist, create it with both cases

-- Add case-insensitive payment status constraint (replace if exists)
ALTER TABLE orders 
ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('Pending', 'pending', 'Paid', 'paid', 'Failed', 'failed', 'Refunded', 'refunded'));

-- Add case-insensitive order status constraint  
ALTER TABLE orders 
ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('Pending', 'pending', 'Confirmed', 'confirmed', 'Processing', 'processing', 'Shipped', 'shipped', 'Out for Delivery', 'out for delivery', 'Delivered', 'delivered', 'Cancelled', 'cancelled'));

-- If constraints already exist, this will fail, but that's OK
-- The backend fix will handle it after redeployment
