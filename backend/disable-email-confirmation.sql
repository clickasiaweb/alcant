-- ============================================
-- Disable Email Confirmation and Ensure Database Storage
-- ============================================

-- 1. Disable email confirmation requirement in Supabase Auth
-- This needs to be done in Supabase Dashboard > Authentication > Settings
-- But we can also update via SQL if needed

-- 2. Update the auth service to bypass email confirmation
-- The frontend code already handles this, but let's ensure the database is ready

-- 3. Create a function to handle email confirmation bypass
CREATE OR REPLACE FUNCTION public.bypass_email_confirmation(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get the user record
  SELECT * INTO user_record FROM auth.users WHERE email = user_email;
  
  IF FOUND THEN
    -- Update user to be confirmed
    UPDATE auth.users 
    SET email_confirmed_at = NOW()
    WHERE id = user_record.id;
    
    -- Ensure profile exists
    INSERT INTO public.profiles (id, email, name)
    VALUES (user_record.id, user_record.email, COALESCE(user_record.raw_user_meta_data->>'name', split_part(user_record.email, '@', 1)))
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      updated_at = NOW();
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a trigger to automatically confirm emails on signup
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the email
  NEW.email_confirmed_at = NOW();
  
  -- Ensure profile is created with proper data
  INSERT INTO public.profiles (id, email, name, phone, address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->'address', '{}'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email();

-- 6. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.bypass_email_confirmation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.auto_confirm_email() TO service_role;

-- 7. Update existing unconfirmed users (if any)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 8. Ensure all existing users have profiles
INSERT INTO public.profiles (id, email, name, phone, address)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(u.raw_user_meta_data->'address', '{}'::jsonb)
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  updated_at = NOW();

-- 9. Create a view to check user status
CREATE OR REPLACE VIEW user_status AS
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.name as profile_name,
  p.phone,
  p.address,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Not Confirmed'
  END as confirmation_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 10. Test query to verify everything is working
SELECT 'Email confirmation disabled and user profiles ensured' as status,
       COUNT(*) as total_users
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL;

-- ============================================
-- Instructions:
-- ============================================
-- 
-- 1. Run this SQL script in your Supabase SQL Editor
-- 2. This will:
--    - Auto-confirm all new user emails
--    - Ensure all users have corresponding profiles
--    - Create helper functions for email management
-- 3. The frontend auth service is already configured to bypass email confirmation
-- 4. User data will be stored in the 'profiles' table automatically
--
-- Note: For complete email confirmation disable, you may also need to:
-- - Go to Supabase Dashboard > Authentication > Settings
-- - Set "Enable email confirmations" to OFF
-- ============================================
