/*
  # Create Admin Helper Functions
  
  1. Changes
    - Drop existing functions to avoid conflicts
    - Create secure helper functions for role management
  
  2. Security
    - Use security definer functions
    - Proper schema search path
    - Restricted access through function logic
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_user_role(uuid);
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS get_user_details(uuid);

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

CREATE OR REPLACE FUNCTION check_admin_status(user_id uuid)
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION check_admin_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_details TO authenticated;