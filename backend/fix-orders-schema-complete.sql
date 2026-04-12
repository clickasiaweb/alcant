-- Complete orders schema fix script
-- This script ensures all required columns exist and match the backend expectations

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Check and add discount column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'discount'
    ) THEN
        ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0.00;
        COMMENT ON COLUMN orders.discount IS 'Discount amount applied to the order (currency value)';
    END IF;

    -- Check and add subtotal column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0.00;
        COMMENT ON COLUMN orders.subtotal IS 'Subtotal of all products before tax and shipping';
    END IF;

    -- Check and add tax column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'tax'
    ) THEN
        ALTER TABLE orders ADD COLUMN tax DECIMAL(10, 2) DEFAULT 0.00;
        COMMENT ON COLUMN orders.tax IS 'Tax amount (18% GST)';
    END IF;

    -- Check and add shipping column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'shipping'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping DECIMAL(10, 2) DEFAULT 0.00;
        COMMENT ON COLUMN orders.shipping IS 'Shipping cost';
    END IF;

    -- Check and add products column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'products'
    ) THEN
        ALTER TABLE orders ADD COLUMN products JSONB;
        COMMENT ON COLUMN orders.products IS 'Array of products with details, quantities, and variants';
    END IF;

    -- Check and add payment_method column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
        COMMENT ON COLUMN orders.payment_method IS 'Payment method used (Credit Card, PayPal, etc.)';
    END IF;

    -- Check and add payment_details column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_details'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_details JSONB;
        COMMENT ON COLUMN orders.payment_details IS 'Payment transaction details';
    END IF;

    -- Check and add order_status column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'order_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN order_status VARCHAR(20) DEFAULT 'Pending';
        COMMENT ON COLUMN orders.order_status IS 'Current order status';
    END IF;

    -- Check and add status_history column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status_history'
    ) THEN
        ALTER TABLE orders ADD COLUMN status_history JSONB DEFAULT '[]';
        COMMENT ON COLUMN orders.status_history IS 'History of all status changes with timestamps and notes';
    END IF;

    -- Check and add estimated_delivery column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'estimated_delivery'
    ) THEN
        ALTER TABLE orders ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE;
        COMMENT ON COLUMN orders.estimated_delivery IS 'Estimated delivery date';
    END IF;

    -- Check and add tracking_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'tracking_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN tracking_id VARCHAR(100);
        COMMENT ON COLUMN orders.tracking_id IS 'Courier tracking ID for shipped orders';
    END IF;
END $$;

-- Create indexes for performance if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_discount') THEN
        CREATE INDEX idx_orders_discount ON orders(discount);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_subtotal') THEN
        CREATE INDEX idx_orders_subtotal ON orders(subtotal);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_order_status') THEN
        CREATE INDEX idx_orders_order_status ON orders(order_status);
    END IF;
END $$;

-- Update existing orders to have default values if they are NULL
UPDATE orders 
SET 
    discount = COALESCE(discount, 0.00),
    subtotal = COALESCE(subtotal, 0.00),
    tax = COALESCE(tax, 0.00),
    shipping = COALESCE(shipping, 0.00),
    status_history = COALESCE(status_history, '[]'::jsonb)
WHERE discount IS NULL OR subtotal IS NULL OR tax IS NULL OR shipping IS NULL OR status_history IS NULL;

-- Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
