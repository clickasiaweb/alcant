-- Orders table schema for Supabase
-- Run this SQL in your Supabase SQL editor to create the orders table

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  products JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
  shipping DECIMAL(10,2) DEFAULT 0 CHECK (shipping >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
  payment_method VARCHAR(50) NOT NULL,
  payment_details JSONB,
  order_status VARCHAR(20) DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')),
  tracking_id VARCHAR(100),
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  notes TEXT,
  status_history JSONB DEFAULT '[]',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_shipping_email ON orders USING GIN ((shipping_address->>'email'));
CREATE INDEX idx_orders_shipping_phone ON orders USING GIN ((shipping_address->>'phone'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to increment stock (for order cancellation/restoration)
CREATE OR REPLACE FUNCTION increment_stock(x int)
RETURNS int AS $$
BEGIN
    RETURN x;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to add status to history
CREATE OR REPLACE FUNCTION add_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Only add to history if status actually changed
    IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
        NEW.status_history = COALESCE(NEW.status_history, '[]')::jsonb || 
            jsonb_build_object(
                'status', NEW.order_status,
                'timestamp', NOW(),
                'note', COALESCE(NEW.notes, ''),
                'updatedBy', NULL -- This will be set in the application
            );
    END IF;
    
    -- Set specific timestamps based on status
    IF NEW.order_status = 'Delivered' AND OLD.order_status != 'Delivered' THEN
        NEW.actual_delivery = NOW();
    ELSIF NEW.order_status = 'Cancelled' AND OLD.order_status != 'Cancelled' THEN
        NEW.cancelled_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for status history
CREATE TRIGGER order_status_history_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION add_order_status_history();

-- Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy: Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Admins can insert any order
CREATE POLICY "Admins can insert any order" ON orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Admins can update any order
CREATE POLICY "Admins can update any order" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Users can update their own orders (limited fields)
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (
        auth.uid()::text = user_id::text AND
        -- Only allow cancellation
        (OLD.order_status != 'Cancelled' AND NEW.order_status = 'Cancelled')
    );

-- Sample data for testing (optional)
INSERT INTO orders (
    order_id,
    user_id,
    products,
    subtotal,
    tax,
    shipping,
    discount,
    total_amount,
    payment_status,
    payment_method,
    payment_details,
    order_status,
    tracking_id,
    shipping_address,
    billing_address,
    notes,
    estimated_delivery
) SELECT 
    'ORD' || EXTRACT(EPOCH FROM NOW())::bigint || FLOOR(RANDOM() * 1000)::text,
    u.id,
    JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT(
            'productId', p.id,
            'name', p.name,
            'price', p.final_price,
            'quantity', 1,
            'image', p.image,
            'variant', JSONB_BUILD_OBJECT('color', 'Black', 'size', 'M')
        )
    ),
    p.final_price,
    p.final_price * 0.18,
    CASE WHEN p.final_price > 1000 THEN 0 ELSE 50 END,
    0,
    p.final_price + (p.final_price * 0.18) + CASE WHEN p.final_price > 1000 THEN 0 ELSE 50 END,
    'Paid',
    'Credit Card',
    JSONB_BUILD_OBJECT('transactionId', 'TXN' || EXTRACT(EPOCH FROM NOW())::bigint, 'paidAt', NOW()),
    'Confirmed',
    'TRK' || EXTRACT(EPOCH FROM NOW())::bigint,
    JSONB_BUILD_OBJECT(
        'firstName', 'John',
        'lastName', 'Doe',
        'address', '123 Main St',
        'city', 'Mumbai',
        'state', 'Maharashtra',
        'postalCode', '400001',
        'country', 'India',
        'phone', '+919876543210',
        'email', u.email
    ),
    NULL,
    'Sample order for testing',
    NOW() + INTERVAL '3 days'
FROM users u, products p 
WHERE u.role = 'user' 
LIMIT 1;

-- Comments for documentation
COMMENT ON TABLE orders IS 'Customer orders with complete order management and tracking';
COMMENT ON COLUMN orders.order_id IS 'Unique order identifier (ORD + timestamp + random)';
COMMENT ON COLUMN orders.user_id IS 'Reference to the user who placed the order';
COMMENT ON COLUMN orders.products IS 'Array of products with details, quantities, and variants';
COMMENT ON COLUMN orders.status_history IS 'History of all status changes with timestamps and notes';
COMMENT ON COLUMN orders.shipping_address IS 'Complete shipping address in JSON format';
COMMENT ON COLUMN orders.billing_address IS 'Billing address (defaults to shipping if not provided)';
COMMENT ON COLUMN orders.tracking_id IS 'Courier tracking ID for shipped orders';
