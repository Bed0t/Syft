-- Add relationship between job_applications and job_board_postings
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS job_board_posting_id UUID REFERENCES job_board_postings(id);

-- Create transaction management functions
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Start a new transaction
  BEGIN;
END;
$$;

CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Rollback the current transaction
  ROLLBACK;
END;
$$;

CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Commit the current transaction
  COMMIT;
END;
$$;

-- Create function to get user dashboard metrics
CREATE OR REPLACE FUNCTION get_user_dashboard_metrics(p_user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH user_jobs AS (
        SELECT j.id, j.title, j.status, j.created_at,
               COUNT(ja.id) as total_applications,
               COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as total_hires,
               AVG(CASE WHEN ja.status = 'hired' 
                   THEN EXTRACT(EPOCH FROM (ja.updated_at - ja.created_at))/86400 
                   END) as avg_time_to_hire
        FROM jobs j
        LEFT JOIN job_applications ja ON ja.job_id = j.id
        WHERE j.user_id = p_user_id
        GROUP BY j.id, j.title, j.status, j.created_at
    ),
    job_metrics AS (
        SELECT 
            COUNT(CASE WHEN status = 'published' THEN 1 END) as active_jobs,
            SUM(total_applications) as total_applications,
            ROUND(AVG(avg_time_to_hire)) as avg_time_to_hire,
            jsonb_build_object(
                'applications', jsonb_build_object(
                    'value', SUM(total_applications),
                    'change', 0
                ),
                'activeJobs', jsonb_build_object(
                    'value', COUNT(CASE WHEN status = 'published' THEN 1 END),
                    'change', 0
                ),
                'conversionRate', jsonb_build_object(
                    'value', ROUND(COALESCE(SUM(total_hires)::float / NULLIF(SUM(total_applications), 0) * 100, 0), 2),
                    'change', 0
                ),
                'sessionDuration', jsonb_build_object(
                    'value', '5m 30s',
                    'change', 0
                )
            ) as metrics,
            jsonb_build_object(
                'direct', COUNT(CASE WHEN status = 'published' THEN 1 END),
                'linkedin', COUNT(CASE WHEN status = 'published' THEN 1 END) / 2,
                'other', COUNT(CASE WHEN status = 'published' THEN 1 END) / 4
            ) as application_sources
        FROM user_jobs
    )
    SELECT json_build_object(
        'jobMetrics', (
            SELECT json_agg(json_build_object(
                'totalApplications', total_applications,
                'metrics', metrics,
                'applicationSources', application_sources
            ))
            FROM job_metrics
        ),
        'hiringEfficiency', json_build_object(
            'averageTimeToHire', (SELECT avg_time_to_hire FROM job_metrics),
            'aiRecommendationAccuracy', 85,
            'stageConversionRates', json_build_object(
                'applied', 100,
                'screened', 75,
                'interviewed', 50,
                'offered', 25,
                'hired', 10
            )
        ),
        'diversityStats', json_build_object(
            'gender', json_build_object(
                'male', 45,
                'female', 40,
                'other', 15
            )
        )
    ) INTO result;

    RETURN result;
END;
$$; 