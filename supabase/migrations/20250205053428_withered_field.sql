/*
  # Interview System Schema

  1. New Tables
    - `interviews`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references candidates)
      - `job_id` (uuid, references jobs)
      - `status` (enum: scheduled, in_progress, completed, failed)
      - `scheduled_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `synthflow_interview_id` (text)
      - `technical_score` (numeric)
      - `communication_score` (numeric)
      - `cultural_score` (numeric)
      - `overall_score` (numeric)
      - `transcript` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `interview_questions`
      - `id` (uuid, primary key)
      - `interview_id` (uuid, references interviews)
      - `question` (text)
      - `answer` (text)
      - `score` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

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

-- Create trigger for interviews table
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();