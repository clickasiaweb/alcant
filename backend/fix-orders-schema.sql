-- ============================================
-- Fix Orders Schema - Add Missing Columns
-- ============================================

-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS products JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Update existing orders to have order_id if missing
UPDATE orders 
SET order_id = 'ORD' || EXTRACT(EPOCH FROM created_at)::TEXT || LPAD((RANDOM() * 1000)::INT::TEXT, 3, '0')
WHERE order_id IS NULL;

-- Add RLS policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own orders
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

-- Policy for users to insert their own orders
CREATE POLICY "Users can insert own orders" ON orders
FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Policy for users to update their own orders
CREATE POLICY "Users can update own orders" ON orders
FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT);

-- Policy for admins to do everything
CREATE POLICY "Admins can manage all orders" ON orders
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create function to automatically set user_id
CREATE OR REPLACE FUNCTION set_current_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set user_id
CREATE TRIGGER set_orders_user_id
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_current_user_id();

-- Insert sample order for testing
INSERT INTO orders (
  order_id,
  user_id,
  order_number,
  products,
  subtotal,
  tax,
  shipping,
  discount,
  total_amount,
  shipping_address,
  billing_address,
  payment_method,
  payment_details,
  notes,
  status,
  payment_status,
  status_history
) VALUES (
  'ORD' || EXTRACT(EPOCH FROM NOW())::TEXT || '001',
  '00000000-0000-0000-0000-000000000000',
  'ORD' || EXTRACT(EPOCH FROM NOW())::TEXT || '001',
  '[
    {
      "id": "sample-product-1",
      "name": "Sample Product",
      "price": 1000,
      "quantity": 1,
      "image": "/images/sample.jpg"
    }
  ]',
  1000.00,
  180.00,
  0.00,
  0.00,
  1180.00,
  '{
    "firstName": "Sample",
    "lastName": "User",
    "email": "sample@example.com",
    "phone": "1234567890",
    "address": "123 Sample Street",
    "city": "Sample City",
    "state": "Sample State",
    "zipCode": "12345",
    "country": "Sample Country"
  }',
  '{
    "firstName": "Sample",
    "lastName": "User",
    "email": "sample@example.com",
    "phone": "1234567890",
    "address": "123 Sample Street",
    "city": "Sample City",
    "state": "Sample State",
    "zipCode": "12345",
    "country": "Sample Country"
  }',
  'Credit Card',
  '{
    "paidAt": "' || NOW()::TEXT || '",
    "transactionId": "TXN' || EXTRACT(EPOCH FROM NOW())::TEXT || '"
  }',
  'Sample order for testing',
  'pending',
  'paid',
  '[
    {
      "status": "Pending",
      "timestamp": "' || NOW()::TEXT || '",
      "note": "Order placed",
      "updatedBy": "system"
    }
  ]'
) ON CONFLICT (order_id) DO NOTHING;

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
