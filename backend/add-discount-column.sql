-- Add discount column to orders table
-- This SQL script adds the missing discount column to fix order placement

ALTER TABLE orders 
ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0.00;

-- Add comment for documentation
COMMENT ON COLUMN orders.discount IS 'Discount amount applied to the order (currency value)';

-- Update existing orders to have default discount of 0
UPDATE orders 
SET discount = 0.00 
WHERE discount IS NULL;

-- Add index for better performance on discount queries
CREATE INDEX idx_orders_discount ON orders(discount);
