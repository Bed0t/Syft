-- Drop analytics-related tables
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS hiring_funnel_metrics CASCADE;
DROP TABLE IF EXISTS job_board_analytics CASCADE;
DROP TABLE IF EXISTS diversity_metrics CASCADE;

-- Drop analytics-related functions
DROP FUNCTION IF EXISTS get_platform_metrics();
DROP FUNCTION IF EXISTS get_user_metrics();
DROP FUNCTION IF EXISTS get_ai_metrics();
DROP FUNCTION IF EXISTS get_user_dashboard_metrics(UUID);
DROP FUNCTION IF EXISTS get_dashboard_metrics(UUID);
DROP FUNCTION IF EXISTS begin_transaction();
DROP FUNCTION IF EXISTS rollback_transaction();
DROP FUNCTION IF EXISTS commit_transaction();

-- Remove analytics columns from existing tables
ALTER TABLE jobs DROP COLUMN IF EXISTS metrics;
ALTER TABLE jobs DROP COLUMN IF EXISTS ai_match_score;
ALTER TABLE jobs DROP COLUMN IF EXISTS time_to_hire;
ALTER TABLE jobs DROP COLUMN IF EXISTS total_cost;

ALTER TABLE job_applications DROP COLUMN IF EXISTS ai_recommended;
ALTER TABLE job_applications DROP COLUMN IF EXISTS screening_time;
ALTER TABLE job_applications DROP COLUMN IF EXISTS interview_scheduled_at;
ALTER TABLE job_applications DROP COLUMN IF EXISTS diversity_data;
ALTER TABLE job_applications DROP COLUMN IF EXISTS drop_off_stage;
ALTER TABLE job_applications DROP COLUMN IF EXISTS drop_off_reason;
ALTER TABLE job_applications DROP COLUMN IF EXISTS job_board_posting_id;

-- Drop analytics views if they exist
DROP VIEW IF EXISTS hiring_efficiency_view; 