/*
  # Admin Schema Setup

  1. Create role type and update auth.users
  2. Set up admin sessions table
  3. Add RLS policies
*/

-- Drop existing enum if exists and recreate
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- Update auth.users table
ALTER TABLE auth.users DROP COLUMN IF EXISTS role;
ALTER TABLE auth.users ADD COLUMN role text DEFAULT 'user';

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

-- Set up initial admin user
UPDATE auth.users 
SET role = 'super_admin' 
WHERE email = 'admin@syft.com';