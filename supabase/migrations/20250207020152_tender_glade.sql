/*
  # Add Jobs and Analytics Tables

  1. New Tables
    - jobs
      - Core job posting information
      - Tracks status, views, and applications
    - job_applications
      - Application tracking
      - Links candidates to jobs
    - job_board_postings
      - Tracks where jobs are posted
      - Stores external job board IDs
    - application_status_history
      - Tracks status changes
      - Enables analytics on hiring funnel
    - job_analytics
      - Real-time analytics data
      - Views, clicks, applications metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Add policies for admin access

  3. Changes
    - Add real-time tracking capabilities
    - Enable analytics collection
*/

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  department text NOT NULL,
  location jsonb NOT NULL,
  type text NOT NULL,
  seniority_level text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  salary_range jsonb,
  skills text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  job_boards text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  views integer DEFAULT 0,
  applications_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL DEFAULT 'applied',
  resume_url text,
  cover_letter text,
  answers jsonb DEFAULT '{}',
  interview_score numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job Board Postings table
CREATE TABLE IF NOT EXISTS job_board_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) NOT NULL,
  board_name text NOT NULL,
  external_id text,
  status text NOT NULL DEFAULT 'pending',
  posted_at timestamptz,
  expires_at timestamptz,
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Application Status History table
CREATE TABLE IF NOT EXISTS application_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES job_applications(id) NOT NULL,
  status text NOT NULL,
  notes text,
  changed_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Job Analytics table
CREATE TABLE IF NOT EXISTS job_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) NOT NULL,
  date date NOT NULL,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  applications integer DEFAULT 0,
  interviews_scheduled integer DEFAULT 0,
  interviews_completed integer DEFAULT 0,
  offers_sent integer DEFAULT 0,
  offers_accepted integer DEFAULT 0,
  source_breakdown jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, date)
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_board_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for jobs
CREATE POLICY "Users can view their own jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Users can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR auth.uid() IN (SELECT id FROM admin_users));

-- Policies for job applications
CREATE POLICY "Users can view their own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    auth.uid() IN (SELECT user_id FROM jobs WHERE id = job_id) OR
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Users can create applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for job board postings
CREATE POLICY "Users can view job board postings"
  ON job_board_postings
  FOR SELECT
  TO authenticated
  USING (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Policies for application status history
CREATE POLICY "Users can view application status history"
  ON application_status_history
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM job_applications WHERE 
        user_id = auth.uid() OR
        job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
    ) OR
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Policies for job analytics
CREATE POLICY "Users can view job analytics"
  ON job_analytics
  FOR SELECT
  TO authenticated
  USING (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Add triggers for updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_board_postings_updated_at
  BEFORE UPDATE ON job_board_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_analytics_updated_at
  BEFORE UPDATE ON job_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update application counts
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs 
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs 
    SET applications_count = applications_count - 1
    WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for application count
CREATE TRIGGER update_job_application_count
  AFTER INSERT OR DELETE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_application_count();

-- Function to update analytics on application status change
CREATE OR REPLACE FUNCTION update_job_analytics_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update analytics for the current date
  INSERT INTO job_analytics (job_id, date)
  SELECT NEW.job_id, CURRENT_DATE
  WHERE NOT EXISTS (
    SELECT 1 FROM job_analytics 
    WHERE job_id = NEW.job_id AND date = CURRENT_DATE
  );

  -- Update relevant metrics based on status
  UPDATE job_analytics
  SET 
    applications = CASE 
      WHEN NEW.status = 'applied' THEN applications + 1 
      ELSE applications 
    END,
    interviews_scheduled = CASE 
      WHEN NEW.status = 'interview_scheduled' THEN interviews_scheduled + 1 
      ELSE interviews_scheduled 
    END,
    interviews_completed = CASE 
      WHEN NEW.status = 'interview_completed' THEN interviews_completed + 1 
      ELSE interviews_completed 
    END,
    offers_sent = CASE 
      WHEN NEW.status = 'offer_sent' THEN offers_sent + 1 
      ELSE offers_sent 
    END,
    offers_accepted = CASE 
      WHEN NEW.status = 'offer_accepted' THEN offers_accepted + 1 
      ELSE offers_accepted 
    END,
    updated_at = now()
  WHERE job_id = NEW.job_id AND date = CURRENT_DATE;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for analytics updates
CREATE TRIGGER update_analytics_on_application_status
  AFTER INSERT OR UPDATE OF status ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_analytics_on_status_change();