/*
  # Fix Role Management System

  1. Changes
    - Creates proper user_roles table with enum type
    - Adds necessary indexes and constraints
    - Sets up RLS policies
    - Migrates existing users to new role system

  2. Security
    - Implements proper role validation
    - Sets up secure access control
    - Maintains data integrity
*/

-- Create role enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'super_admin');
  END IF;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY,
  role user_role_enum NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user_id
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_user_role UNIQUE (id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
  DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
  DROP POLICY IF EXISTS "Super admins can manage roles" ON user_roles;

  -- Create new policies
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
        AND role IN ('admin'::user_role_enum, 'super_admin'::user_role_enum)
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
        AND role = 'super_admin'::user_role_enum
      )
    );
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_roles_updated_at'
  ) THEN
    CREATE TRIGGER set_user_roles_updated_at
      BEFORE UPDATE ON user_roles
      FOR EACH ROW
      EXECUTE FUNCTION update_user_roles_updated_at();
  END IF;
END $$;

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