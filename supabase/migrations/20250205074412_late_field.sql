/*
  # Fix Role Management System

  1. Changes
    - Creates a proper user_roles view with correct permissions
    - Adds necessary indexes for performance
    - Updates RLS policies for proper access control

  2. Security
    - Ensures proper role checking
    - Maintains existing role values
    - Adds proper constraints
*/

-- Drop existing view if exists
DROP VIEW IF EXISTS user_roles;

-- Create proper user_roles view
CREATE OR REPLACE VIEW user_roles AS 
SELECT 
  id,
  email,
  role,
  created_at,
  last_sign_in_at
FROM auth.users;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON auth.users(role);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth.users(email);

-- Grant proper permissions
GRANT SELECT ON user_roles TO authenticated;

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION is_valid_role(role_name text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT role_name IN ('user', 'admin', 'super_admin');
$$;

-- Add proper constraint to role column
DO $$ 
BEGIN
  ALTER TABLE auth.users 
    DROP CONSTRAINT IF EXISTS valid_role_check;
  
  ALTER TABLE auth.users 
    ADD CONSTRAINT valid_role_check 
    CHECK (is_valid_role(role));
END $$;

-- Update RLS policies
CREATE OR REPLACE FUNCTION check_admin_access()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Create or replace policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own role or admins can view all" ON auth.users;
  
  CREATE POLICY "Users can view own role or admins can view all"
    ON auth.users
    FOR SELECT
    TO authenticated
    USING (
      id = auth.uid() 
      OR check_admin_access()
    );
END $$;

-- Ensure admin user exists with correct role
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@syft.com'
  ) THEN
    -- Note: This is just a placeholder as we can't actually insert into auth.users directly
    -- The actual admin user should be created through the auth API
    RAISE NOTICE 'Admin user needs to be created through the auth API';
  ELSE
    UPDATE auth.users 
    SET role = 'super_admin' 
    WHERE email = 'admin@syft.com'
    AND role != 'super_admin';
  END IF;
END $$;