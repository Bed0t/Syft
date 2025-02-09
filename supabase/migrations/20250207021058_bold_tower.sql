/*
  # Reset Analytics Data to Zero

  1. Changes
    - Reset all analytics counters to 0
    - Initialize empty source breakdowns
    - Ensure all metrics start from zero

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions
*/

-- Reset job counters
UPDATE jobs
SET 
  views = 0,
  applications_count = 0,
  updated_at = now();

-- Reset job analytics
UPDATE job_analytics
SET
  views = 0,
  clicks = 0,
  applications = 0,
  interviews_scheduled = 0,
  interviews_completed = 0,
  offers_sent = 0,
  offers_accepted = 0,
  source_breakdown = '{}'::jsonb,
  updated_at = now();

-- Reset job board posting metrics
UPDATE job_board_postings
SET
  metrics = '{}'::jsonb,
  updated_at = now();

-- Function to ensure new analytics entries start at zero
CREATE OR REPLACE FUNCTION initialize_analytics_defaults()
RETURNS trigger AS $$
BEGIN
  NEW.views = 0;
  NEW.clicks = 0;
  NEW.applications = 0;
  NEW.interviews_scheduled = 0;
  NEW.interviews_completed = 0;
  NEW.offers_sent = 0;
  NEW.offers_accepted = 0;
  NEW.source_breakdown = '{}'::jsonb;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new analytics entries
CREATE TRIGGER ensure_zero_analytics_defaults
  BEFORE INSERT ON job_analytics
  FOR EACH ROW
  EXECUTE FUNCTION initialize_analytics_defaults();