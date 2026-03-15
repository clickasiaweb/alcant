# Bulk Product Upload Feature

## Overview

This feature enables administrators to bulk upload products using Excel files (.xlsx/.xls/.csv) to the ecommerce website. It includes comprehensive validation, error handling, and a user-friendly interface.

## Features

✅ **Excel Template Download** - Pre-formatted template with all required columns  
✅ **File Upload & Validation** - Drag-and-drop interface with file type/size validation  
✅ **Data Preview** - Review parsed data before import  
✅ **Comprehensive Validation** - Check for required fields, duplicates, and data integrity  
✅ **Error Reporting** - Detailed error messages with row numbers  
✅ **Variant Support** - Handle product variants (color, size, price, stock)  
✅ **Image Management** - Support for multiple product images  
✅ **Category Management** - Auto-create categories if they don't exist  
✅ **Progress Tracking** - Real-time upload status and completion reports  

## File Structure

### Backend Files

```
backend/
├── controllers/
│   └── bulkUploadController.js     # Main upload logic
├── routes/
│   └── bulkUpload.js              # API routes
├── models/
│   ├── Product.js                 # Updated product model
│   ├── ProductVariant.js          # New variant model
│   ├── ProductImage.js            # New image model
│   ├── Category.js
│   ├── SubCategory.js
│   └── SubSubCategory.js
└── server.js                      # Updated with bulk upload routes
```

### Frontend Files

```
admin-panel/
├── src/
│   ├── pages/
│   │   └── BulkUploadPage.jsx     # Main upload interface
│   ├── components/
│   │   └── Sidebar.jsx            # Updated with bulk upload link
│   └── App.jsx                    # Updated with bulk upload route
```

## API Endpoints

### GET `/api/bulk-upload/template`
Downloads the Excel template file.

**Response:** Excel file download

### POST `/api/bulk-upload/parse`
Parses and validates the uploaded Excel file.

**Request:** FormData with file
**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "errors": [...],
    "totalRows": 100,
    "validProducts": 95,
    "invalidRows": 5
  }
}
```

### POST `/api/bulk-upload/import`
Imports validated products to the database.

**Request:**
```json
{
  "products": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Import completed. 95 products imported successfully, 5 failed.",
  "results": {
    "success": [...],
    "errors": [...]
  }
}
```

## Excel Template Structure

### Required Columns

| Column | Type | Example | Description |
|--------|------|---------|-------------|
| product_name | string | iPhone 15 Pro Case | Product name |
| slug | string | iphone-15-pro-case | URL-friendly slug |
| description | text | Premium silicone case... | Detailed description |
| short_description | text | Soft protective case | Brief description |
| brand | string | Apple | Brand name |
| category | string | Electronics | Main category |
| sub_category | string | Mobile Accessories | Subcategory |
| sub_sub_category | string | Phone Cases | Sub-subcategory |
| price | number | 799 | Regular price |
| sale_price | number | 599 | Sale price (optional) |
| stock | number | 100 | Stock quantity |
| sku | string | ALC-IP15P-BLK | Unique SKU |
| color | string | Black | Product color |
| size | string | Standard | Product size |
| weight | number | 200 | Weight in grams |
| image_1 | URL | https://.../image1.jpg | Primary image |
| image_2 | URL | https://.../image2.jpg | Secondary image |
| image_3 | URL | https://.../image3.jpg | Additional image |
| image_4 | URL | https://.../image4.jpg | Additional image |

### Variant Columns (Optional)

| Column | Example | Description |
|--------|---------|-------------|
| variant_color | Black, Blue, Red | Comma-separated colors |
| variant_size | M, L, XL | Comma-separated sizes |
| variant_price | 799,899,999 | Comma-separated prices |
| variant_stock | 20,30,25 | Comma-separated stock |

## Database Schema Updates

### Product Model (Updated)
- Added `shortDescription`, `brand`, `salePrice`, `subSubCategory`
- Added `sku` (unique), `color`, `size`, `weight`
- Improved slug generation and price calculation

### ProductVariant Model (New)
```javascript
{
  product: ObjectId,
  color: String,
  size: String,
  price: Number,
  stock: Number,
  sku: String,
  isActive: Boolean
}
```

### ProductImage Model (New)
```javascript
{
  product: ObjectId,
  imageUrl: String,
  altText: String,
  position: Number,
  isActive: Boolean
}
```

## Usage Instructions

### For Administrators

1. **Download Template**
   - Navigate to Admin Panel → Products → Bulk Upload
   - Click "Download Template" to get the Excel file

2. **Fill Product Data**
   - Open the downloaded Excel file
   - Fill in product information following the column structure
   - Use variant columns for products with multiple options
   - Ensure all required fields are completed

3. **Upload File**
   - Return to the Bulk Upload page
   - Drag and drop your Excel file or click to select
   - Click "Parse File" to validate data

4. **Review and Import**
   - Review validation results and any errors
   - Preview valid products in the table
   - Click "Import Products" to add them to the database
   - Monitor import progress and results

### Error Handling

The system provides detailed error messages including:
- **Row-specific errors** with exact row numbers
- **Field validation errors** (missing required fields, invalid formats)
- **Duplicate detection** for slugs and SKUs
- **URL validation** for image links
- **Category validation** ensuring categories exist

### Performance Considerations

- **File size limit:** 10MB maximum
- **Row limit:** Designed for 5000+ products per upload
- **Background processing:** Import runs asynchronously
- **Memory efficient:** Stream-based Excel parsing

## Security Features

✅ **Admin-only access** - Authentication middleware required  
✅ **File type validation** - Only Excel/CSV files accepted  
✅ **File size limits** - Prevents oversized uploads  
✅ **Data sanitization** - Input validation and cleaning  
✅ **SQL injection protection** - Mongoose ODM safeguards  

## Installation & Setup

### Dependencies Installed
```bash
# Backend
npm install xlsx formidable

# Frontend (already installed)
npm install react-dropzone axios react-toastify
```

### Environment Variables
Ensure your backend `.env` includes:
```
MONGODB_URI_PRIMARY=your_mongodb_connection
MONGODB_URI_FALLBACK=your_fallback_connection
```

### Frontend Environment
Add to admin panel `.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

## Testing

### Manual Testing Steps

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Admin Panel**
   ```bash
   cd admin-panel
   npm start
   ```

3. **Test Template Download**
   - Navigate to `/bulk-upload`
   - Click "Download Template"
   - Verify Excel file downloads correctly

4. **Test File Upload**
   - Fill template with sample data
   - Upload and parse file
   - Review validation results
   - Complete import process

5. **Verify Database**
   - Check products were created correctly
   - Verify variants and images were added
   - Confirm categories were created if needed

## Troubleshooting

### Common Issues

**"File upload failed"**
- Check file size is under 10MB
- Verify file format is .xlsx, .xls, or .csv
- Ensure backend is running and accessible

**"Missing required columns"**
- Download fresh template
- Ensure column names match exactly (case-sensitive)
- Don't rename or delete columns

**"Slug already exists"**
- Each product needs a unique slug
- Check existing products in database
- Update duplicate slugs in Excel file

**"Invalid category"**
- Category names must match existing categories
- New categories will be auto-created
- Check for typos in category names

### Debug Mode

Add to backend for detailed logging:
```javascript
// In bulkUploadController.js
console.log('Parsed data:', JSON.stringify(parsedData, null, 2));
```

## Future Enhancements

### Phase 2 Features
- [ ] CSV and Google Sheets import
- [ ] AI-powered product description generation
- [ ] Automatic category detection
- [ ] Duplicate product detection
- [ ] Supplier feed integration
- [ ] Bulk image upload with ZIP files
- [ ] Import history and rollback
- [ ] Scheduled imports
- [ ] Advanced validation rules
- [ ] Custom field mapping

### Performance Improvements
- [ ] Queue-based processing for large files
- [ ] Progress bars with percentage
- [ ] Chunked uploads for very large files
- [ ] Background worker processes
- [ ] Database transaction optimization

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for JavaScript errors
3. Check backend logs for server errors
4. Verify database connection and permissions
5. Test with the provided sample template

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-15  
**Compatible:** Node.js 18+, React 18+, MongoDB 5+
