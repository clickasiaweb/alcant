-- STEP 4: Sample data insertion (optional)
-- Example: Insert sample data for Electronics category

-- Insert sample Electronics category (if not exists)
INSERT INTO categories (name, slug, description, is_active) 
VALUES ('Electronics', 'electronics', 'Electronic devices and accessories', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subcategories for Electronics
INSERT INTO subcategories (name, slug, category_id, description, is_active)
SELECT 
  subcat.name,
  subcat.slug,
  cat.id,
  subcat.description,
  true
FROM categories cat
CROSS JOIN (VALUES 
  ('Phones', 'phones', 'Smartphones and mobile phones'),
  ('Laptops', 'laptops', 'Laptop computers and notebooks'),
  ('Tablets', 'tablets', 'Tablet computers and e-readers'),
  ('Accessories', 'accessories', 'Electronic accessories and peripherals')
) AS subcat(name, slug, description)
WHERE cat.slug = 'electronics'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert sample sub-subcategories for Phones
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, sort_order, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  variant.sort_order,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('Smartphones', 'smartphones', 'Modern smartphones with advanced features', 1),
  ('Feature Phones', 'feature-phones', 'Basic mobile phones with essential features', 2),
  ('Phone Cases', 'phone-cases', 'Protective cases and covers', 3),
  ('Phone Accessories', 'phone-accessories', 'Chargers, cables, and other accessories', 4)
) AS variant(name, slug, description, sort_order)
WHERE sub.slug = 'phones'
ON CONFLICT (subcategory_id, slug) DO NOTHING;

-- Insert sample sub-subcategories for Laptops
INSERT INTO sub_subcategories (name, slug, subcategory_id, description, sort_order, is_active)
SELECT 
  variant.name,
  variant.slug,
  sub.id,
  variant.description,
  variant.sort_order,
  true
FROM subcategories sub
CROSS JOIN (VALUES 
  ('Gaming Laptops', 'gaming-laptops', 'High-performance laptops for gaming', 1),
  ('Business Laptops', 'business-laptops', 'Professional laptops for work', 2),
  ('Ultrabooks', 'ultrabooks', 'Thin and lightweight laptops', 3),
  ('Laptop Accessories', 'laptop-accessories', 'Bags, mice, and laptop accessories', 4)
) AS variant(name, slug, description, sort_order)
WHERE sub.slug = 'laptops'
ON CONFLICT (subcategory_id, slug) DO NOTHING;
