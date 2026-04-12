# Database Schema Fix Instructions

## Issue Identified
The `discount` column (and other required columns) are missing from the `orders` table in Supabase database.

## Required SQL Commands

Execute these commands in your Supabase SQL Editor:

### 1. Add Discount Column
```sql
ALTER TABLE orders 
ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0.00;

COMMENT ON COLUMN orders.discount IS 'Discount amount applied to the order (currency value)';
```

### 2. Add Other Missing Columns (if not present)
```sql
-- Add subtotal column
ALTER TABLE orders 
ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0.00;

-- Add tax column  
ALTER TABLE orders 
ADD COLUMN tax DECIMAL(10, 2) DEFAULT 0.00;

-- Add shipping column
ALTER TABLE orders 
ADD COLUMN shipping DECIMAL(10, 2) DEFAULT 0.00;

-- Add products column
ALTER TABLE orders 
ADD COLUMN products JSONB;

-- Add payment_method column
ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(50);

-- Add payment_details column
ALTER TABLE orders 
ADD COLUMN payment_details JSONB;

-- Add order_status column
ALTER TABLE orders 
ADD COLUMN order_status VARCHAR(20) DEFAULT 'pending';

-- Add status_history column
ALTER TABLE orders 
ADD COLUMN status_history JSONB DEFAULT '[]';

-- Add estimated_delivery column
ALTER TABLE orders 
ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE;

-- Add tracking_id column
ALTER TABLE orders 
ADD COLUMN tracking_id VARCHAR(100);
```

### 3. Update Existing Records
```sql
UPDATE orders 
SET 
    discount = COALESCE(discount, 0.00),
    subtotal = COALESCE(subtotal, 0.00),
    tax = COALESCE(tax, 0.00),
    shipping = COALESCE(shipping, 0.00),
    status_history = COALESCE(status_history, '[]'::jsonb)
WHERE discount IS NULL OR subtotal IS NULL OR tax IS NULL OR shipping IS NULL OR status_history IS NULL;
```

### 4. Create Indexes
```sql
CREATE INDEX idx_orders_discount ON orders(discount);
CREATE INDEX idx_orders_subtotal ON orders(subtotal);
CREATE INDEX idx_orders_order_status ON orders(order_status);
```

## Quick Fix (Discount Only)
If you only want to fix the immediate discount issue:

```sql
ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0.00;
UPDATE orders SET discount = 0.00 WHERE discount IS NULL;
CREATE INDEX idx_orders_discount ON orders(discount);
```

## Verification
After running the SQL commands, test with:

```bash
cd backend
node check-database-schema.js
```

## Expected Result
After applying the fix:
- Discount column should exist and store values correctly
- Order placement should work without schema errors
- Financial calculations should include discount properly

## Current Status
- Backend code is fixed and ready
- Frontend code is fixed and ready  
- Database schema needs to be updated
- Test shows discount is being sent but not stored (column missing)

## Next Steps
1. Execute SQL commands in Supabase
2. Restart backend server
3. Test order placement from frontend
4. Verify discount is applied correctly
