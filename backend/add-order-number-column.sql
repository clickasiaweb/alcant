-- Add order_number column to existing orders table
-- Run this in your Supabase SQL editor

ALTER TABLE orders 
ADD COLUMN order_number VARCHAR(50) NOT NULL DEFAULT '';

-- Create a unique constraint on order_number
ALTER TABLE orders 
ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);

-- Update existing orders to have order_number (if any exist)
UPDATE orders 
SET order_number = order_id 
WHERE order_number = '';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
