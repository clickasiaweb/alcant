-- STEP 2: Create general hierarchy view
-- Create view for complete category hierarchy
CREATE OR REPLACE VIEW full_categories_hierarchy AS
SELECT 
  c.name as category_name,
  c.slug as category_slug,
  c.description as category_description,
  c.image as category_image,
  s.name as subcategory_name,
  s.slug as subcategory_slug,
  s.description as subcategory_description,
  NULL as subcategory_image,
  ss.name as sub_subcategory_name,
  ss.slug as sub_subcategory_slug,
  ss.description as sub_subcategory_description,
  ss.image as sub_subcategory_image,
  ss.sort_order as sub_subcategory_sort_order,
  ss.id as sub_subcategory_id,
  s.id as subcategory_id,
  c.id as category_id
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = true
LEFT JOIN sub_subcategories ss ON s.id = ss.subcategory_id AND ss.is_active = true
WHERE c.is_active = true
ORDER BY c.name, s.name, ss.sort_order, ss.name;

-- Create view for categories with their subcategories
CREATE OR REPLACE VIEW categories_with_subcategories AS
SELECT 
  c.*,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', s.id,
          'name', s.name,
          'slug', s.slug,
          'description', s.description,
          'image', NULL,
          'sort_order', 0,
          'is_active', s.is_active,
          'sub_subcategories', (
            SELECT json_agg(
              json_build_object(
                'id', ss.id,
                'name', ss.name,
                'slug', ss.slug,
                'description', ss.description,
                'image', ss.image,
                'sort_order', ss.sort_order,
                'is_active', ss.is_active
              ) ORDER BY ss.sort_order, ss.name
            )
            FROM sub_subcategories ss
            WHERE ss.subcategory_id = s.id AND ss.is_active = true
          )
        ) ORDER BY s.name
      )
      FROM subcategories s
      WHERE s.category_id = c.id AND s.is_active = true
    ), '[]'::json
  ) as subcategories
FROM categories c
WHERE c.is_active = true
ORDER BY c.name;
