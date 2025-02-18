# Analytics Database Schema

## New Tables

### analytics_events
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    event_type VARCHAR NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID,
    page_url TEXT,
    client_metadata JSONB
);
```

### user_sessions
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration INTEGER,
    pages_visited JSONB[],
    device_info JSONB
);
```

### hiring_funnel_metrics
```sql
CREATE TABLE hiring_funnel_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    stage VARCHAR NOT NULL,
    count INTEGER DEFAULT 0,
    conversion_rate DECIMAL,
    avg_time_in_stage INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### job_board_analytics
```sql
CREATE TABLE job_board_analytics (
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
```

### diversity_metrics
```sql
CREATE TABLE diversity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    metric_type VARCHAR NOT NULL,
    demographic_data JSONB,
    percentage DECIMAL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Table Modifications

### jobs
```sql
ALTER TABLE jobs
ADD COLUMN metrics JSONB,
ADD COLUMN ai_match_score DECIMAL,
ADD COLUMN time_to_hire INTEGER,
ADD COLUMN total_cost DECIMAL;
```

### job_applications
```sql
ALTER TABLE job_applications
ADD COLUMN ai_recommended BOOLEAN DEFAULT FALSE,
ADD COLUMN screening_time INTEGER,
ADD COLUMN interview_scheduled_at TIMESTAMPTZ,
ADD COLUMN diversity_data JSONB,
ADD COLUMN drop_off_stage VARCHAR,
ADD COLUMN drop_off_reason TEXT;
```

## Indexes
```sql
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_hiring_funnel_metrics_job_id ON hiring_funnel_metrics(job_id);
CREATE INDEX idx_job_board_analytics_job_id ON job_board_analytics(job_id);
```

## Views

### hiring_efficiency_view
```sql
CREATE VIEW hiring_efficiency_view AS
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
```

## Security Policies
```sql
-- Analytics events RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own analytics events"
ON analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics events"
ON analytics_events FOR SELECT
USING (auth.uid() = user_id);

-- Admin access policy
CREATE POLICY "Admins can view all analytics"
ON analytics_events FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    )
);
``` 