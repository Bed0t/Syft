/*
  # Admin Role and Sessions Setup
  
  1. Create admin sessions table
  2. Set up RLS policies
  3. Update user roles
*/

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

-- Create RLS policies for admin_sessions
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own sessions" ON admin_sessions;
  DROP POLICY IF EXISTS "Users can create own sessions" ON admin_sessions;
  DROP POLICY IF EXISTS "Users can delete own sessions" ON admin_sessions;
  
  -- Create new policies
  CREATE POLICY "Users can read own sessions"
    ON admin_sessions
    FOR SELECT
    USING (user_id = auth.uid());

  CREATE POLICY "Users can create own sessions"
    ON admin_sessions
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

  CREATE POLICY "Users can delete own sessions"
    ON admin_sessions
    FOR DELETE
    USING (user_id = auth.uid());
END $$;

-- Update admin user role
UPDATE auth.users 
SET role = 'super_admin' 
WHERE email = 'admin@syft.com';