/*
  # Fix Auth Users Access
  
  1. Changes
    - Create a secure view for accessing user roles
    - Update RLS policies to use the view
    - Add helper functions for role checks
  
  2. Security
    - Enable RLS on the view
    - Add appropriate policies
*/

-- Create a secure view for user roles
CREATE OR REPLACE VIEW user_roles AS
SELECT id, role, email
FROM auth.users;

-- Enable RLS on the view
ALTER VIEW user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for the view
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'super_admin')
    )
  );

-- Create helper functions
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