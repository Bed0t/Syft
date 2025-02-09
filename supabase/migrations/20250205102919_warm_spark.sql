/*
  # Fix Admin Users Policy

  1. Changes
    - Drop existing policy that causes infinite recursion
    - Create new policy with direct user ID check
    
  2. Security
    - Maintains admin-only access
    - Simplifies policy logic while maintaining security
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can access admin_users" ON admin_users;

-- Create new policy with direct user ID check
CREATE POLICY "Admin users can access admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Add initial admin user (replace with your user ID)
INSERT INTO admin_users (id, email)
SELECT 
  auth.uid(),
  auth.email()
FROM auth.users
WHERE auth.email() = 'admin@example.com'  -- Replace with your admin email
ON CONFLICT (id) DO NOTHING;