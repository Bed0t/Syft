/*
  # Fix Role System
  
  1. Drop existing role column and type
  2. Create new role column as text
  3. Set up admin roles
*/

-- First remove any existing role-based policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Super admins can do everything" ON admin_audit_logs;
  DROP POLICY IF EXISTS "Admins can view all jobs" ON jobs;
  DROP POLICY IF EXISTS "Admins can view all candidates" ON candidates;
  DROP POLICY IF EXISTS "Admins can view all interviews" ON interviews;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Drop the role column if it exists
ALTER TABLE auth.users DROP COLUMN IF EXISTS role;

-- Add role as text column
ALTER TABLE auth.users ADD COLUMN role text DEFAULT 'user';

-- Create admin_sessions table if it doesn't exist
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