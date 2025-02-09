/*
  # Job Board Distribution and Notification Schema

  1. New Tables
    - `job_distributions`: Track job postings across different platforms
    - `notifications`: System notifications for users

  2. New Types
    - `distribution_status`: Track job posting status
    - `notification_type`: Define notification delivery methods

  3. Security
    - Enable RLS on all tables
    - Add policies for company-based access control

  4. Changes
    - Add job distribution tracking
    - Add notification system
    - Add performance metrics for job postings
*/

-- Create status enums if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'distribution_status') THEN
    CREATE TYPE distribution_status AS ENUM (
      'pending',
      'posted',
      'failed',
      'expired'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'email',
      'sms'
    );
  END IF;
END $$;

-- Create notifications table if it doesn't exist
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

-- Create job_distributions table if it doesn't exist
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

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_distributions_job'
  ) THEN
    CREATE INDEX idx_distributions_job ON job_distributions(job_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_distributions_platform'
  ) THEN
    CREATE INDEX idx_distributions_platform ON job_distributions(platform);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_distributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can manage their job distributions'
  ) THEN
    CREATE POLICY "Users can manage their job distributions"
      ON job_distributions
      USING (
        EXISTS (
          SELECT 1 FROM jobs
          WHERE jobs.id = job_distributions.job_id
          AND jobs.company_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can manage their notifications'
  ) THEN
    CREATE POLICY "Users can manage their notifications"
      ON notifications
      USING (recipient = auth.email());
  END IF;
END $$;

-- Create trigger for job_distributions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_distributions_updated_at'
  ) THEN
    CREATE TRIGGER update_distributions_updated_at
      BEFORE UPDATE ON job_distributions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;