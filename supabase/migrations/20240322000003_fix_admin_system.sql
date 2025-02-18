/*
  # Fix Admin System

  1. Changes
    - Consolidate admin role management
    - Add session management functions
    - Add audit logging
    - Add rate limiting
    - Add IP whitelisting support
  
  2. Security
    - Use security definer functions
    - Proper schema search path
    - Rate limiting
    - IP whitelisting
    - Audit logging
*/

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  identifier text,
  max_attempts integer DEFAULT 5,
  window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
BEGIN
  -- Clean up old entries
  DELETE FROM auth_rate_limits 
  WHERE created_at < now() - (window_minutes || ' minutes')::interval;
  
  -- Get current count
  SELECT COUNT(*) INTO current_count
  FROM auth_rate_limits
  WHERE rate_limit_key = identifier
  AND created_at > now() - (window_minutes || ' minutes')::interval;
  
  -- Insert new attempt
  INSERT INTO auth_rate_limits (rate_limit_key)
  VALUES (identifier);
  
  RETURN current_count < max_attempts;
END;
$$;

-- Create IP whitelist function
CREATE OR REPLACE FUNCTION is_ip_whitelisted(ip_address text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_ip_whitelist
    WHERE ip = ip_address
    AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Create enhanced admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ip_addr text;
  is_whitelisted boolean;
BEGIN
  -- Get client IP
  ip_addr := current_setting('request.headers', true)::json->>'x-forwarded-for';
  
  -- Check IP whitelist if enabled
  SELECT EXISTS (
    SELECT 1 FROM admin_settings
    WHERE key = 'enforce_ip_whitelist'
    AND value = 'true'
  ) INTO is_whitelisted;
  
  -- If whitelist is enforced, check IP
  IF is_whitelisted THEN
    IF NOT is_ip_whitelisted(ip_addr) THEN
      RETURN false;
    END IF;
  END IF;

  -- Check admin status
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND role IN ('admin', 'super_admin')
  );
END;
$$;

-- Create admin session management functions
CREATE OR REPLACE FUNCTION create_admin_session(user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_id uuid;
BEGIN
  -- Verify admin status
  IF NOT is_admin(user_id) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Create session
  INSERT INTO admin_sessions (
    user_id,
    expires_at,
    last_active
  ) VALUES (
    user_id,
    now() + interval '24 hours',
    now()
  ) RETURNING id INTO session_id;

  -- Log action
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    table_name,
    changes
  ) VALUES (
    user_id,
    'CREATE_SESSION',
    'admin_sessions',
    jsonb_build_object('session_id', session_id)
  );

  RETURN session_id;
END;
$$;

CREATE OR REPLACE FUNCTION verify_admin_session(session_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_valid boolean;
BEGIN
  UPDATE admin_sessions
  SET last_active = now()
  WHERE id = session_id
  AND expires_at > now()
  AND user_id = auth.uid()
  RETURNING true INTO is_valid;

  RETURN COALESCE(is_valid, false);
END;
$$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_limit_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_ip_whitelist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(ip)
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_ip_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only super admins can manage IP whitelist"
  ON admin_ip_whitelist
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can manage settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'super_admin'
    )
  );

-- Insert default settings
INSERT INTO admin_settings (key, value, description)
VALUES 
  ('enforce_ip_whitelist', 'false', 'Whether to enforce IP whitelist for admin access'),
  ('max_session_duration', '24', 'Maximum session duration in hours'),
  ('max_failed_attempts', '5', 'Maximum failed login attempts before lockout'),
  ('lockout_duration', '15', 'Account lockout duration in minutes')
ON CONFLICT (key) DO NOTHING;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_session TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_session TO authenticated; 