/*
  # Interview System Schema

  1. New Tables
    - `candidates`
      - Basic candidate information
      - Contact details
    - `jobs`
      - Job posting information
    - `interviews`
      - Interview scheduling and results
      - Synthflow.ai integration
    - `interview_questions`
      - Individual interview questions and scores

  2. Security
    - RLS enabled on all tables
    - Company-based access control
*/

-- Create jobs table first (if not exists)
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview status enum
CREATE TYPE interview_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'failed'
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  status interview_status NOT NULL DEFAULT 'scheduled',
  scheduled_at timestamptz NOT NULL,
  completed_at timestamptz,
  synthflow_interview_id text,
  technical_score numeric CHECK (technical_score >= 0 AND technical_score <= 100),
  communication_score numeric CHECK (communication_score >= 0 AND communication_score <= 100),
  cultural_score numeric CHECK (cultural_score >= 0 AND cultural_score <= 100),
  overall_score numeric CHECK (overall_score >= 0 AND overall_score <= 100),
  transcript text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid REFERENCES interviews(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  score numeric CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own company interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = interviews.job_id
      AND jobs.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own company interviews"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = interviews.job_id
      AND jobs.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own company interview questions"
  ON interview_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      JOIN jobs ON interviews.job_id = jobs.id
      WHERE interview_questions.interview_id = interviews.id
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

-- Create triggers for updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();