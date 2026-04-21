-- Check what constraints actually exist on the orders table
SELECT conname, contype, pg_get_constraintdef(pg_constraint.oid) AS definition
FROM pg_constraint 
WHERE conrelid = 'orders'::regclass 
ORDER BY conname;
