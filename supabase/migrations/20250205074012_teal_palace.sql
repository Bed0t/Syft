-- Drop existing role-related objects
DROP VIEW IF EXISTS user_roles;
DROP POLICY IF EXISTS "Users can view own role or admins can view all" ON auth.users;

-- Ensure role column is properly set up
ALTER TABLE auth.users DROP COLUMN IF EXISTS role;
ALTER TABLE auth.users ADD COLUMN role text NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create secure view for user roles
CREATE OR REPLACE VIEW user_roles AS 
SELECT id, email, role 
FROM auth.users;

-- Grant access to authenticated users
GRANT SELECT ON user_roles TO authenticated;

-- Create policies for secure access
CREATE POLICY "Users can view own role or admins can view all"
ON auth.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR (
    SELECT role IN ('admin', 'super_admin')
    FROM auth.users
    WHERE id = auth.uid()
  )
);

-- Ensure admin user exists with correct role
INSERT INTO auth.users (email, role, encrypted_password)
VALUES (
  'admin@syft.com',
  'super_admin',
  crypt('admin123', gen_salt('bf'))
)
ON CONFLICT (email) 
DO UPDATE SET role = 'super_admin';