-- Complete schema fix for orders table
-- This script adds all missing columns that the backend expects

-- Add order_id column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'order_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN order_id VARCHAR(50);
        COMMENT ON COLUMN orders.order_id IS 'Unique order identifier';
    END IF;
END $$;

-- Add discount column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'discount'
    ) THEN
        ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0.00;
        COMMENT ON COLUMN orders.discount IS 'Discount amount';
    END IF;
END $$;

-- Add subtotal column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0.00;
    END IF;
END $$;

-- Add tax column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'tax'
    ) THEN
        ALTER TABLE orders ADD COLUMN tax DECIMAL(10, 2) DEFAULT 0.00;
    END IF;
END $$;

-- Add shipping column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'shipping'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping DECIMAL(10, 2) DEFAULT 0.00;
    END IF;
END $$;

-- Add products column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'products'
    ) THEN
        ALTER TABLE orders ADD COLUMN products JSONB;
    END IF;
END $$;

-- Add payment_method column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
    END IF;
END $$;

-- Add payment_details column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_details'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_details JSONB;
    END IF;
END $$;

-- Add order_status column if missing (if using 'status' instead)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'order_status'
    ) THEN
        -- Check if 'status' column exists and rename it
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'status'
        ) THEN
            ALTER TABLE orders RENAME COLUMN status TO order_status;
        ELSE
            ALTER TABLE orders ADD COLUMN order_status VARCHAR(20) DEFAULT 'pending';
        END IF;
    END IF;
END $$;

-- Add status_history column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status_history'
    ) THEN
        ALTER TABLE orders ADD COLUMN status_history JSONB DEFAULT '[]';
    END IF;
END $$;

-- Add estimated_delivery column if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'estimated_delivery'
    ) THEN
        ALTER TABLE orders ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Update existing records with default values
UPDATE orders 
SET 
    order_id = COALESCE(order_id, 'ORD-' || id::text),
    discount = COALESCE(discount, 0.00),
    subtotal = COALESCE(subtotal, 0.00),
    tax = COALESCE(tax, 0.00),
    shipping = COALESCE(shipping, 0.00),
    status_history = COALESCE(status_history, '[]'::jsonb)
WHERE order_id IS NULL OR discount IS NULL OR subtotal IS NULL OR tax IS NULL OR shipping IS NULL;

-- Create unique constraint on order_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_order_id_key'
    ) THEN
        ALTER TABLE orders ADD CONSTRAINT orders_order_id_key UNIQUE (order_id);
    END IF;
END $$;

-- Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
