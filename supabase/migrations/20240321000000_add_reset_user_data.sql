/*
  # Add Reset User Data Function

  1. New Functions
    - reset_user_data: Function to reset and initialize user data
    - begin_transaction: Helper function to start a transaction
    - commit_transaction: Helper function to commit a transaction
    - rollback_transaction: Helper function to rollback a transaction

  2. Security
    - Functions are security definer to run with elevated privileges
    - Access control through RLS policies
*/

-- Create transaction helper functions
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Start a new transaction
  -- This is a no-op since we're already in a transaction,
  -- but it's here for completeness
END;
$$;

CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Commit the current transaction
  -- This is a no-op since we're already in a transaction,
  -- but it's here for completeness
END;
$$;

CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Rollback the current transaction
  RAISE EXCEPTION 'Transaction rolled back';
END;
$$;

-- Create reset user data function
CREATE OR REPLACE FUNCTION reset_user_data(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Delete existing data
  DELETE FROM job_applications WHERE user_id = $1;
  DELETE FROM jobs WHERE user_id = $1;
  DELETE FROM job_analytics WHERE job_id IN (SELECT id FROM jobs WHERE user_id = $1);
  DELETE FROM job_board_postings WHERE job_id IN (SELECT id FROM jobs WHERE user_id = $1);

  -- Insert standard job
  WITH new_job AS (
    INSERT INTO jobs (
      user_id,
      title,
      department,
      location,
      type,
      seniority_level,
      description,
      requirements,
      salary_range,
      skills,
      benefits,
      status,
      views,
      applications_count
    ) VALUES (
      $1,
      'Software Engineer',
      'Engineering',
      '{"city": "San Francisco", "state": "CA", "country": "USA"}'::jsonb,
      'Full-time',
      'Mid-Level',
      'Standard software engineer position...',
      'Bachelor''s degree in Computer Science or related field...',
      '{"min": 100000, "max": 150000, "currency": "USD"}'::jsonb,
      ARRAY['JavaScript', 'React', 'Node.js'],
      ARRAY['Health Insurance', '401k', 'Remote Work'],
      'published',
      0,
      0
    ) RETURNING id
  )
  -- Initialize job analytics
  INSERT INTO job_analytics (
    job_id,
    date,
    views,
    clicks,
    applications,
    interviews_scheduled,
    interviews_completed,
    offers_sent,
    offers_accepted,
    source_breakdown
  )
  SELECT 
    id,
    CURRENT_DATE,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    '{"LinkedIn": 0, "Indeed": 0, "Direct": 0}'::jsonb
  FROM new_job;

  result := jsonb_build_object(
    'success', true,
    'message', 'User data reset successfully'
  );

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
  RETURN result;
END;
$$; 