-- Orders table schema for Supabase (Fixed Version)
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

-- Indexes for performance (Removed problematic GIN indexes)
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
        NEW.cancellation_reason = COALESCE(NEW.notes, 'Order cancelled');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically add status to history
CREATE TRIGGER order_status_history_trigger
    BEFORE INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION add_order_status_history();

-- Row Level Security (RLS) Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy: Users can only insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can only update their own orders
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policy: Admins can do everything (you'll need to create an admin role and policies)
CREATE POLICY "Admins full access" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Comments for documentation
COMMENT ON TABLE orders IS 'Orders table for e-commerce system with full order tracking and status management';
COMMENT ON COLUMN orders.order_id IS 'Human-readable order identifier (e.g., ORD-2024-12345)';
COMMENT ON COLUMN orders.user_id IS 'Reference to the user who placed the order';
COMMENT ON COLUMN orders.products IS 'JSON array of products in the order';
COMMENT ON COLUMN orders.status_history IS 'JSON array of status changes with timestamps';
COMMENT ON COLUMN orders.tracking_id IS 'Shipping tracking number from courier';
