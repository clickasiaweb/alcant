-- Temporarily disable the trigger that might be causing 500 errors
-- Run this in Supabase SQL editor

DROP TRIGGER IF EXISTS order_status_history_trigger ON orders;

-- You can re-enable it later with:
-- CREATE TRIGGER order_status_history_trigger
--     BEFORE INSERT OR UPDATE ON orders
--     FOR EACH ROW
--     EXECUTE FUNCTION add_order_status_history();
