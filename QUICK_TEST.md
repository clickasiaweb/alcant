# Quick Test - Does Your Data Exist?

## Test 1: Check Backend API
Open this URL in your browser:
```
http://localhost:5000/api/categories/all/with-subcategories
```

**Expected Result:** You should see JSON like:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Electronics", 
      "slug": "electronics",
      "subcategories": [
        {
          "name": "Phones",
          "sub_subcategories": [...]
        }
      ]
    }
  ]
}
```

## Test 2: Check Database Directly
In Supabase SQL Editor, run:
```sql
SELECT * FROM categories_with_subcategories;
```

**Expected Result:** Should show Electronics with nested subcategories.

## Test 3: Check Raw Tables
```sql
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'subcategories', COUNT(*) FROM subcategories  
UNION ALL
SELECT 'sub_subcategories', COUNT(*) FROM sub_subcategories;
```

**Expected Result:** Should show 1, 4, and 8 (or more) rows.

## If Tests Fail:

### No data in database?
Re-run the sample data SQL:
```sql
-- From step-4-sample-data.sql
INSERT INTO categories (name, slug, description, is_active) 
VALUES ('Electronics', 'electronics', 'Electronic devices and accessories', true)
ON CONFLICT (slug) DO NOTHING;
```

### API returns error?
Check backend console for database connection errors.

### Data exists but admin panel empty?
1. Open browser dev tools (F12)
2. Go to Network tab
3. Load admin panel categories page
4. Look for failed API calls

## Most Common Fix:
The admin panel expects `data.data` but might get `data.categories`. Check the API response format in browser network tab.
