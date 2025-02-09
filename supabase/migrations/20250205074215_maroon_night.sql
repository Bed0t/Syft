/*
  # Role Management System Enhancement

  1. Changes
    - Creates role management functions with unique names
    - Adds proper indexes for role lookups
    - Enhances RLS policies for role-based access
    - Adds audit logging for role changes

  2. Security
    - Implements proper role checking
    - Adds security definer functions
    - Sets up proper access control
*/

-- Create indexes for role-based queries if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_users_role'
  ) THEN
    CREATE INDEX idx_users_role ON auth.users(role);
  END IF;
END $$;

-- Create enhanced role management functions
CREATE OR REPLACE FUNCTION check_user_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = required_role
  FROM auth.users
  WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION check_user_admin_access(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role IN ('admin', 'super_admin')
  FROM auth.users
  WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION get_user_role_details(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  last_sign_in timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, 
    email, 
    role,
    last_sign_in_at
  FROM auth.users
  WHERE id = user_id
  AND (
    id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'super_admin')
    )
  );
$$;

-- Create role change audit function
CREATE OR REPLACE FUNCTION audit_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO admin_audit_logs (
      admin_id,
      action,
      table_name,
      record_id,
      changes,
      ip_address
    ) VALUES (
      auth.uid(),
      'UPDATE',
      'auth.users',
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role
      ),
      current_setting('request.headers')::jsonb->>'x-forwarded-for'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create role change audit trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'audit_role_change_trigger'
  ) THEN
    CREATE TRIGGER audit_role_change_trigger
      BEFORE UPDATE OF role
      ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION audit_role_change();
  END IF;
END $$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION check_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_admin_access TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role_details TO authenticated;

-- Enhance existing RLS policies
ALTER POLICY "Users can view own role or admins can view all"
  ON auth.users
  USING (
    auth.uid() = id 
    OR check_user_admin_access(auth.uid())
  );

-- Create policy for role updates
CREATE POLICY "Only super admins can update roles"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (check_user_role(auth.uid(), 'super_admin'))
  WITH CHECK (check_user_role(auth.uid(), 'super_admin'));