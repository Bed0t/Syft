/*
  # Fix User Roles and Permissions
  
  1. Changes
    - Drop existing role column
    - Add role as text column with proper constraints
    - Create secure user_roles view
    - Set up initial admin user
  
  2. Security
    - Proper role validation
    - Secure view access
*/

-- First clean up any existing role setup
ALTER TABLE auth.users DROP COLUMN IF EXISTS role;

-- Add role as text column with constraint
ALTER TABLE auth.users 
ADD COLUMN role text NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create secure view for user roles
CREATE OR REPLACE VIEW user_roles AS 
SELECT id, email, role 
FROM auth.users;

-- Grant access to authenticated users
GRANT SELECT ON user_roles TO authenticated;

-- Create policy for user_roles view access
CREATE POLICY "Users can view own role or admins can view all"
ON auth.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() 
    AND u.role IN ('admin', 'super_admin')
  )
);

-- Set up initial admin user if not exists
UPDATE auth.users 
SET role = 'super_admin' 
WHERE email = 'admin@syft.com';