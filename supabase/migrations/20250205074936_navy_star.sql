/*
  # Fix Role Management System

  1. Changes
    - Creates proper user_role_enum type
    - Sets up user_roles table with proper constraints
    - Adds necessary indexes and relationships
    - Updates RLS policies

  2. Security
    - Ensures proper role validation
    - Maintains data integrity
    - Implements proper access control
*/

-- Create role enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'super_admin');
  END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_role UNIQUE (id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

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

-- Create function to sync roles from auth.users
CREATE OR REPLACE FUNCTION sync_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_roles (id, role)
  VALUES (NEW.id, 'user'::user_role_enum)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_roles();

-- Migrate existing users
INSERT INTO user_roles (id, role)
SELECT id, 
  CASE 
    WHEN email = 'admin@syft.com' THEN 'super_admin'::user_role_enum
    ELSE 'user'::user_role_enum
  END
FROM auth.users
ON CONFLICT (id) DO NOTHING;