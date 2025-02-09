/*
  # Admin Roles and Sessions Schema

  1. New Types
    - Create user_role enum type for role management
  
  2. Tables
    - Add role column to auth.users
    - Create admin_sessions table
  
  3. Security
    - Add RLS policies for admin access
*/

-- Create role enum type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
  END IF;
END $$;

-- Add role column to auth.users if it doesn't exist
ALTER TABLE auth.users 
  ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'::user_role;

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own sessions"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own sessions"
  ON admin_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON admin_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create admin user if it doesn't exist
INSERT INTO auth.users (email, role, encrypted_password)
SELECT 'admin@syft.com', 'super_admin'::user_role, crypt('admin123', gen_salt('bf'))
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@syft.com'
);