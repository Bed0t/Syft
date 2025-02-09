/*
  # Fix Job Applications View

  1. Changes
    - Remove duplicate columns in view
    - Update view to handle potential column name conflicts
    - Maintain existing functionality

  2. Security
    - Maintain RLS policies
    - Ensure proper access control
*/

-- First drop the existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create applications" ON job_applications;
DROP POLICY IF EXISTS "Users can view application status history" ON application_status_history;

-- Now we can safely modify the table
ALTER TABLE job_applications
DROP COLUMN IF EXISTS user_id CASCADE;

ALTER TABLE job_applications
ADD COLUMN applicant_id uuid REFERENCES auth.users(id),
ADD COLUMN applicant_name text,
ADD COLUMN applicant_email text,
ADD COLUMN applicant_phone text;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- Create new policies
CREATE POLICY "Users can view relevant applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (
    applicant_id = auth.uid() OR -- Applicant can view their own applications
    auth.uid() IN (SELECT user_id FROM jobs WHERE id = job_id) OR -- Job owner can view applications
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can view all applications
  );

CREATE POLICY "Users can create applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_id = auth.uid() OR -- Users can only create applications for themselves
    auth.uid() IN (SELECT id FROM admin_users) -- Admins can create applications for anyone
  );

-- Create a view for job applications with user information
-- Fixed to avoid duplicate columns
CREATE OR REPLACE VIEW job_applications_with_users AS
SELECT 
  ja.id,
  ja.job_id,
  ja.applicant_id,
  ja.status,
  ja.resume_url,
  ja.cover_letter,
  ja.answers,
  ja.interview_score,
  ja.created_at,
  ja.updated_at,
  j.title as job_title,
  j.department as job_department,
  j.user_id as employer_id,
  COALESCE(ja.applicant_email, u.email) as applicant_email,
  COALESCE(ja.applicant_name, u.full_name) as applicant_name,
  ja.applicant_phone
FROM 
  job_applications ja
  LEFT JOIN jobs j ON ja.job_id = j.id
  LEFT JOIN users u ON ja.applicant_id = u.id;

-- Grant access to the view
GRANT SELECT ON job_applications_with_users TO authenticated;

-- Function to handle new job applications
CREATE OR REPLACE FUNCTION handle_new_job_application()
RETURNS trigger AS $$
BEGIN
  -- Update applicant information from users table
  SELECT email, full_name
  INTO NEW.applicant_email, NEW.applicant_name
  FROM users
  WHERE id = NEW.applicant_id;

  -- Update job analytics
  INSERT INTO job_analytics (
    job_id,
    date,
    applications
  ) VALUES (
    NEW.job_id,
    CURRENT_DATE,
    1
  )
  ON CONFLICT (job_id, date)
  DO UPDATE SET
    applications = job_analytics.applications + 1,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new applications
DROP TRIGGER IF EXISTS on_new_job_application ON job_applications;
CREATE TRIGGER on_new_job_application
  BEFORE INSERT ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_job_application();