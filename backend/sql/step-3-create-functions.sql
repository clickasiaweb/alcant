-- STEP 3: Create helper functions
-- Function to get category path
CREATE OR REPLACE FUNCTION get_category_path(category_slug TEXT)
RETURNS TABLE (
  level INTEGER,
  name VARCHAR(255),
  slug VARCHAR(255),
  id UUID,
  parent_id UUID
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Base case: get the main category
    SELECT 
      1 as level,
      c.name,
      c.slug,
      c.id,
      NULL::UUID as parent_id
    FROM categories c
    WHERE c.slug = category_slug AND c.is_active = true
    
    UNION ALL
    
    -- Get subcategories
    SELECT 
      2 as level,
      s.name,
      s.slug,
      s.id,
      c.id as parent_id
    FROM categories c
    JOIN subcategories s ON c.id = s.category_id
    WHERE c.slug = category_slug AND c.is_active = true AND s.is_active = true
    
    UNION ALL
    
    -- Get sub-subcategories
    SELECT 
      3 as level,
      ss.name,
      ss.slug,
      ss.id,
      s.id as parent_id
    FROM categories c
    JOIN subcategories s ON c.id = s.category_id
    JOIN sub_subcategories ss ON s.id = ss.subcategory_id
    WHERE c.slug = category_slug AND c.is_active = true AND s.is_active = true AND ss.is_active = true
  )
  SELECT * FROM category_tree ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- Function to count items in each level
CREATE OR REPLACE FUNCTION count_category_levels()
RETURNS TABLE (
  category_name VARCHAR(255),
  category_slug VARCHAR(255),
  subcategory_count INTEGER,
  sub_subcategory_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name,
    c.slug,
    COUNT(DISTINCT s.id) as subcategory_count,
    COUNT(DISTINCT ss.id) as sub_subcategory_count
  FROM categories c
  LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = true
  LEFT JOIN sub_subcategories ss ON s.id = ss.subcategory_id AND ss.is_active = true
  WHERE c.is_active = true
  GROUP BY c.id, c.name, c.slug
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql;
