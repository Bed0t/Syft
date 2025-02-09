-- Drop user_roles related objects
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;
DROP FUNCTION IF EXISTS verify_user_role CASCADE;
DROP FUNCTION IF EXISTS verify_admin_status CASCADE;

-- Ensure role column in auth.users is properly set up
DO $$
BEGIN
  -- First remove the column if it exists
  ALTER TABLE auth.users DROP COLUMN IF EXISTS role;
  
  -- Add the column back with the correct type and constraint
  ALTER TABLE auth.users ADD COLUMN role text NOT NULL DEFAULT 'user'
  CONSTRAINT valid_role CHECK (
    role IN ('user', 'admin', 'super_admin')
  );
END $$;

-- Create secure view for user roles
CREATE OR REPLACE VIEW user_roles AS 
SELECT 
  id,
  email,
  role,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE 
  auth.uid() = id 
  OR EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
    AND u.role IN ('admin', 'super_admin')
  );

-- Create role management functions
CREATE OR REPLACE FUNCTION check_user_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND role = required_role
  )
$$;

CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND role IN ('admin', 'super_admin')
  )
$$;

-- Grant necessary permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Create RLS policies for auth.users
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own role or admins can view all" ON auth.users;
  DROP POLICY IF EXISTS "Only super admins can update roles" ON auth.users;

  -- Create new policies
  CREATE POLICY "Users can view own role or admins can view all"
    ON auth.users
    FOR SELECT
    TO authenticated
    USING (
      id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'super_admin')
      )
    );

  CREATE POLICY "Only super admins can update roles"
    ON auth.users
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.role = 'super_admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = auth.uid()
        AND u.role = 'super_admin'
      )
    );
END $$;

-- Ensure admin user has correct role
UPDATE auth.users 
SET role = 'super_admin' 
WHERE email = 'admin@syft.com';