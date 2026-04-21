-- Fix user_id foreign key constraint
-- Make user_id nullable temporarily

ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Or alternatively, set a default user_id for testing
-- This allows orders without authentication temporarily

-- Verify the change
\d orders
