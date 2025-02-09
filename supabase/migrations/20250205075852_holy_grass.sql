/*
  # Fix User Roles System

  1. Changes
    - Drop existing role-related objects
    - Create proper user_roles table
    - Set up RLS policies
    - Add helper functions
    - Migrate existing users

  2. Security
    - Enable RLS on user_roles table
    - Add policies for role-based access
    - Ensure proper constraints and validations

  3. Data Migration
    - Preserve existing user roles
    - Set up initial admin user
*/

-- Drop existing role-related objects
DROP VIEW IF EXISTS user_roles CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

-- Create role enum type
CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'super_admin');

-- Create user_roles table
CREATE TABLE user_roles (
  id uuid PRIMARY KEY,
  role user_role_enum NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user_id
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Super admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_roles_updated_at();

-- Create role management functions
CREATE OR REPLACE FUNCTION check_user_role(user_id uuid, required_role user_role_enum)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE id = user_id
    AND role = required_role
  );
$$;

CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE id = user_id
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Migrate existing users
INSERT INTO user_roles (id, role)
SELECT 
  id,
  CASE 
    WHEN email = 'admin@syft.com' THEN 'super_admin'::user_role_enum
    ELSE 'user'::user_role_enum
  END
FROM auth.users
ON CONFLICT (id) 
DO UPDATE SET 
  role = EXCLUDED.role,
  updated_at = now();

-- Grant necessary permissions
GRANT USAGE ON TYPE user_role_enum TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;