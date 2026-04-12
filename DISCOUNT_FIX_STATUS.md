# Discount Fix Status & Next Steps

## Current Status
- ✅ **Discount column exists** in database (user confirmed)
- ✅ **Backend code updated** to handle discount properly
- ✅ **Frontend code updated** to send discount field
- ❌ **Discount not storing** in database (testing shows it's being sent but stored as 0)

## Issue Identified
The discount value is being sent correctly from frontend to backend, but when stored in the database it becomes 0. This suggests one of the following:
1. Database default value constraint overriding the insert
2. Database trigger setting discount to 0
3. Data type conversion issue

## Fixes Applied to Backend Code

### 1. Number Conversion
```javascript
// Before
const discountAmount = discount || 0;

// After  
const discountAmount = parseFloat(discount) || 0;
```

### 2. Explicit Casting in Order Data
```javascript
// Before
discount: discountAmount,

// After
discount: parseFloat(discountAmount),
```

### 3. All Numeric Fields Cast
```javascript
const orderData = {
  subtotal: parseFloat(subtotal),
  tax: parseFloat(tax),
  shipping: parseFloat(shipping),
  discount: parseFloat(discountAmount),
  total_amount: parseFloat(totalAmount),
  // ... other fields
};
```

## Database Fix Options

### Option 1: Remove Default Constraint (Recommended)
Run this SQL in Supabase:
```sql
ALTER TABLE orders ALTER COLUMN discount DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN discount SET DEFAULT 0.00;
ALTER TABLE orders ALTER COLUMN discount DROP NOT NULL;
```

File: `backend/fix-discount-column-default.sql`

### Option 2: Check for Triggers
Run this SQL to check for triggers:
```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'orders';
```

File: `backend/check-discount-constraints.sql`

## Next Steps

### Step 1: Apply Database Fix
Choose one of the database fix options above and run the SQL in Supabase.

### Step 2: Restart Backend Server
```bash
# Stop current server (if running)
# Then restart
cd backend
npm start
```

### Step 3: Test the Fix
```bash
cd backend
node test-discount-debug.js
```

Expected result:
```
Discount sent: 150
Discount stored: 150  <-- Should match
```

## Test Results Before Fix
```
Discount sent: 150
Discount stored: 0  ❌
Total Amount: 2360 (should be 2210 with discount)
```

## Test Results After Fix (Expected)
```
Discount sent: 150
Discount stored: 150  ✅
Total Amount: 2210 (correct with discount)
```

## Files Modified
- `backend/controllers/orderControllerSupabase.js` - Added parseFloat() conversions
- `backend/fix-discount-column-default.sql` - Database constraint fix
- `backend/check-discount-constraints.sql` - Trigger/constraint check

## Summary
The code fixes are complete and ready. The issue is likely a database constraint that needs to be removed. After applying the SQL fix and restarting the server, the discount should work correctly.
