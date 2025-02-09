/*
  # Recruitment System Schema

  1. New Tables
    - `jobs`
      - Core job posting information
      - Status tracking
      - Company relationship
    - `candidates`
      - Candidate personal and professional info
      - Contact details
    - `job_applications`
      - Links candidates to jobs
      - Tracks application status and scores
    - `notifications`
      - System notification logging
    - `job_distributions`
      - Job board posting status
      - Performance metrics

  2. Security
    - RLS policies for all tables
    - Company-based access control
    - Proper data isolation

  3. Performance
    - Indexes on frequently queried columns
    - Updated_at triggers
*/

-- Create status enums
CREATE TYPE job_status AS ENUM (
  'draft',
  'published',
  'closed',
  'archived'
);

CREATE TYPE application_status AS ENUM (
  'new',
  'reviewing',
  'interviewing',
  'offered',
  'hired',
  'rejected'
);

CREATE TYPE distribution_status AS ENUM (
  'pending',
  'posted',
  'failed',
  'expired'
);

CREATE TYPE notification_type AS ENUM (
  'email',
  'sms'
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  department text,
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  location text NOT NULL,
  type text NOT NULL,
  salary_range jsonb,
  status job_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  location text,
  resume_url text,
  experience_years integer,
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'new',
  technical_score numeric CHECK (technical_score >= 0 AND technical_score <= 100),
  communication_score numeric CHECK (communication_score >= 0 AND communication_score <= 100),
  cultural_score numeric CHECK (cultural_score >= 0 AND cultural_score <= 100),
  overall_score numeric CHECK (overall_score >= 0 AND overall_score <= 100),
  notes text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  type notification_type NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create job_distributions table
CREATE TABLE IF NOT EXISTS job_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  platform text NOT NULL,
  external_id text,
  status distribution_status NOT NULL DEFAULT 'pending',
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  applications integer DEFAULT 0,
  posted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, platform)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_distributions_job ON job_distributions(job_id);
CREATE INDEX IF NOT EXISTS idx_distributions_platform ON job_distributions(platform);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_distributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own company jobs"
  ON jobs
  USING (company_id = auth.uid());

CREATE POLICY "Users can view candidates who applied to their jobs"
  ON candidates
  USING (
    EXISTS (
      SELECT 1 FROM job_applications
      JOIN jobs ON job_applications.job_id = jobs.id
      WHERE job_applications.candidate_id = candidates.id
      AND jobs.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage applications for their jobs"
  ON job_applications
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
      AND jobs.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their job distributions"
  ON job_distributions
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_distributions.job_id
      AND jobs.company_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distributions_updated_at
  BEFORE UPDATE ON job_distributions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();