# Admin Panel Data Not Showing - Troubleshooting Checklist

## 🔍 Step-by-Step Diagnosis

### 1. Check Backend Server Status
```bash
cd backend
npm start
```
- Make sure server starts without errors
- Should see "Server running on port 5000" or similar
- Check for any database connection errors

### 2. Test API Endpoints Directly
Open your browser and test these URLs:

**Main Categories Endpoint:**
```
http://localhost:5000/api/categories/all/with-subcategories
```

**Alternative Categories Endpoint:**
```
http://localhost:5000/api/categories
```

**Admin Categories Endpoint:**
```
http://localhost:5000/api/admin/categories
```

You should see JSON data with your Electronics category and subcategories.

### 3. Check Database Views in Supabase
Run these SQL queries in your Supabase SQL Editor:

```sql
-- Test the main view
SELECT * FROM categories_with_subcategories;

-- Test the hierarchy view
SELECT * FROM full_categories_hierarchy;

-- Check raw tables
SELECT * FROM categories;
SELECT * FROM subcategories;
SELECT * FROM sub_subcategories;
```

### 4. Verify Admin Panel Configuration

#### Check API Base URL
In `admin-panel/src/services/api.js`, verify the base URL:
```javascript
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

#### Check Network Requests
Open browser dev tools (F12) → Network tab:
1. Load the admin panel
2. Go to Categories page
3. Look for API calls to `/api/admin/categories`
4. Check if they return 200 status with data

### 5. Frontend Debugging

#### Console Errors
Check browser console for:
- JavaScript errors
- Network errors
- CORS errors

#### API Response Format
The admin panel expects this format:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "subcategories": [
        {
          "id": "...",
          "name": "Phones",
          "slug": "phones",
          "sub_subcategories": [...]
        }
      ]
    }
  ]
}
```

## 🛠️ Common Issues and Solutions

### Issue 1: CORS Errors
**Solution:** Add CORS middleware to backend
```javascript
// In server.js
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3001' })); // admin panel port
```

### Issue 2: Wrong API Endpoint
**Solution:** Update admin panel to use correct endpoint
```javascript
// In api-services.js
export const getAdminCategories = async () => {
  const { data } = await apiClient.get("/categories/all/with-subcategories");
  return data;
};
```

### Issue 3: Environment Variables Missing
**Solution:** Create `.env` file in backend:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Issue 4: Database Views Not Created
**Solution:** Re-run the SQL migration
```sql
-- Run step-2-create-views.sql again
DROP VIEW IF EXISTS categories_with_subcategories;
-- Then recreate the view
```

## 🚀 Quick Fix Steps

### Step 1: Verify Data Exists
```sql
-- Check if you have data
SELECT COUNT(*) as category_count FROM categories;
SELECT COUNT(*) as subcategory_count FROM subcategories;
SELECT COUNT(*) as sub_subcategory_count FROM sub_subcategories;
```

### Step 2: Test Backend Directly
```bash
# Test with curl
curl http://localhost:5000/api/categories/all/with-subcategories
```

### Step 3: Update Admin Panel
If the backend works but admin panel doesn't:
1. Replace CategoriesPage.jsx with the new version
2. Clear browser cache
3. Restart admin panel development server

### Step 4: Check Data Format
The admin panel expects `is_active` field but might receive `isActive`. Check the field names in the API response.

## 📞 If Still Not Working

1. **Check browser console** for specific error messages
2. **Check backend logs** for API request errors
3. **Verify Supabase connection** with a simple test query
4. **Test with Postman** or similar API testing tool

The most common issue is that the backend API endpoints aren't returning the expected data format for the admin panel.
