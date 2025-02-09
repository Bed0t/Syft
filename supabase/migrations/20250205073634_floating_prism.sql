/*
  # Create User Roles Access
  
  1. Changes
    - Create a secure function to check user roles
    - Create helper functions for role checks
  
  2. Security
    - Use security definer functions to safely access auth.users
*/

-- Create helper functions with proper security context
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM auth.users
  WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role IN ('admin', 'super_admin')
  FROM auth.users
  WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION get_user_details(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  role text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, email, role::text
  FROM auth.users
  WHERE id = user_id
  OR EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
    AND u.role IN ('admin', 'super_admin')
  );
$$;

GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_details TO authenticated;