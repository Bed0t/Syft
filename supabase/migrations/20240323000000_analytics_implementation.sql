-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    event_type VARCHAR NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID,
    page_url TEXT,
    client_metadata JSONB
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration INTEGER,
    pages_visited JSONB[],
    device_info JSONB
);

-- Create hiring funnel metrics table
CREATE TABLE IF NOT EXISTS hiring_funnel_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    stage VARCHAR NOT NULL,
    count INTEGER DEFAULT 0,
    conversion_rate DECIMAL,
    avg_time_in_stage INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job board analytics table
CREATE TABLE IF NOT EXISTS job_board_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    board_name VARCHAR NOT NULL,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    cost DECIMAL,
    cost_per_application DECIMAL,
    cost_per_hire DECIMAL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create diversity metrics table
CREATE TABLE IF NOT EXISTS diversity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    metric_type VARCHAR NOT NULL,
    demographic_data JSONB,
    percentage DECIMAL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modify existing tables
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS metrics JSONB,
ADD COLUMN IF NOT EXISTS ai_match_score DECIMAL,
ADD COLUMN IF NOT EXISTS time_to_hire INTEGER,
ADD COLUMN IF NOT EXISTS total_cost DECIMAL;

ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS ai_recommended BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS screening_time INTEGER,
ADD COLUMN IF NOT EXISTS interview_scheduled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS diversity_data JSONB,
ADD COLUMN IF NOT EXISTS drop_off_stage VARCHAR,
ADD COLUMN IF NOT EXISTS drop_off_reason TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hiring_funnel_metrics_job_id ON hiring_funnel_metrics(job_id);
CREATE INDEX IF NOT EXISTS idx_job_board_analytics_job_id ON job_board_analytics(job_id);

-- Create hiring efficiency view
CREATE OR REPLACE VIEW hiring_efficiency_view AS
SELECT 
    j.id as job_id,
    j.title,
    COUNT(ja.id) as total_applications,
    AVG(j.time_to_hire) as avg_time_to_hire,
    SUM(CASE WHEN ja.ai_recommended THEN 1 ELSE 0 END) as ai_recommended_count,
    SUM(CASE WHEN ja.status = 'hired' AND ja.ai_recommended THEN 1 ELSE 0 END) as ai_recommended_hired
FROM jobs j
LEFT JOIN job_applications ja ON j.id = ja.job_id
GROUP BY j.id, j.title;

-- Create dashboard metrics function
CREATE OR REPLACE FUNCTION get_dashboard_metrics(user_id UUID)
RETURNS TABLE (
    job_metrics JSON,
    job_board_performance JSON,
    diversity_stats JSON
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (
            SELECT json_agg(hfm.*)
            FROM hiring_funnel_metrics hfm
            JOIN jobs j ON j.id = hfm.job_id
            WHERE j.user_id = $1
        ) as job_metrics,
        (
            SELECT json_agg(jba.*)
            FROM job_board_analytics jba
            JOIN jobs j ON j.id = jba.job_id
            WHERE j.user_id = $1
        ) as job_board_performance,
        (
            SELECT json_agg(dm.*)
            FROM diversity_metrics dm
            JOIN jobs j ON j.id = dm.job_id
            WHERE j.user_id = $1
        ) as diversity_stats;
END;
$$;

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_funnel_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_board_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE diversity_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert their own analytics events"
ON analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics events"
ON analytics_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions"
ON user_sessions FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their job metrics"
ON hiring_funnel_metrics FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM jobs
        WHERE jobs.id = job_id
        AND jobs.user_id = auth.uid()
    )
);

-- Admin policies
CREATE POLICY "Admins can view all analytics"
ON analytics_events FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    )
); 