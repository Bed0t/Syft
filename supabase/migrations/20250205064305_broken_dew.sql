/*
  # Admin System Implementation

  1. New Tables
    - `admin_users` - Stores admin user information
    - `admin_audit_logs` - Tracks all admin actions
    
  2. Security
    - Enable RLS on all tables
    - Create policies for admin access
    - Add audit logging triggers
*/

-- Create admin role
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Create admin audit logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  changes jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create admin policies
CREATE POLICY "Super admins can do everything"
  ON admin_audit_logs
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'super_admin'
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policies for all existing tables
CREATE POLICY "Admins can view all jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (is_admin() OR company_id = auth.uid());

CREATE POLICY "Admins can view all candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (is_admin() OR id IN (
    SELECT candidate_id FROM job_applications
    JOIN jobs ON job_applications.job_id = jobs.id
    WHERE jobs.company_id = auth.uid()
  ));

CREATE POLICY "Admins can view all interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (is_admin() OR EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = interviews.job_id
    AND jobs.company_id = auth.uid()
  ));

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  IF is_admin() THEN
    INSERT INTO admin_audit_logs (
      admin_id,
      action,
      table_name,
      record_id,
      changes,
      ip_address
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      NEW.id,
      jsonb_build_object(
        'old', to_jsonb(OLD),
        'new', to_jsonb(NEW)
      ),
      current_setting('request.headers')::jsonb->>'x-forwarded-for'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to all relevant tables
CREATE TRIGGER audit_jobs
  AFTER INSERT OR UPDATE OR DELETE ON jobs
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER audit_candidates
  AFTER INSERT OR UPDATE OR DELETE ON candidates
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER audit_interviews
  AFTER INSERT OR UPDATE OR DELETE ON interviews
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();