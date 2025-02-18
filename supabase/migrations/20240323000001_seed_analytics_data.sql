-- Seed hiring funnel metrics
INSERT INTO hiring_funnel_metrics (job_id, stage, count, conversion_rate, avg_time_in_stage)
SELECT 
    j.id,
    stage,
    FLOOR(RANDOM() * 100 + 20),
    ROUND((RANDOM() * 40 + 30)::numeric, 2),
    FLOOR(RANDOM() * 10 + 2)
FROM jobs j
CROSS JOIN (
    VALUES 
        ('applied'),
        ('screened'),
        ('interviewed'),
        ('offered'),
        ('hired')
) AS stages(stage)
WHERE j.status = 'published';

-- Seed job board analytics
INSERT INTO job_board_analytics (job_id, board_name, views, clicks, applications, cost, cost_per_application, cost_per_hire)
SELECT 
    j.id,
    board_name,
    FLOOR(RANDOM() * 1000 + 100),
    FLOOR(RANDOM() * 200 + 50),
    FLOOR(RANDOM() * 50 + 10),
    ROUND((RANDOM() * 1000 + 500)::numeric, 2),
    ROUND((RANDOM() * 100 + 20)::numeric, 2),
    ROUND((RANDOM() * 2000 + 1000)::numeric, 2)
FROM jobs j
CROSS JOIN (
    VALUES 
        ('LinkedIn'),
        ('Indeed'),
        ('Direct'),
        ('Glassdoor')
) AS boards(board_name)
WHERE j.status = 'published';

-- Seed diversity metrics
INSERT INTO diversity_metrics (job_id, metric_type, demographic_data, percentage)
SELECT 
    j.id,
    metric_type,
    CASE metric_type
        WHEN 'gender' THEN 
            jsonb_build_object(
                'male', ROUND((RANDOM() * 40 + 30)::numeric, 2),
                'female', ROUND((RANDOM() * 40 + 20)::numeric, 2),
                'other', ROUND((RANDOM() * 10 + 5)::numeric, 2)
            )
        WHEN 'ethnicity' THEN 
            jsonb_build_object(
                'asian', ROUND((RANDOM() * 30 + 10)::numeric, 2),
                'black', ROUND((RANDOM() * 30 + 10)::numeric, 2),
                'hispanic', ROUND((RANDOM() * 30 + 10)::numeric, 2),
                'white', ROUND((RANDOM() * 30 + 10)::numeric, 2),
                'other', ROUND((RANDOM() * 10 + 5)::numeric, 2)
            )
        WHEN 'location' THEN 
            jsonb_build_object(
                'remote', ROUND((RANDOM() * 40 + 30)::numeric, 2),
                'onsite', ROUND((RANDOM() * 40 + 20)::numeric, 2),
                'hybrid', ROUND((RANDOM() * 20 + 10)::numeric, 2)
            )
    END,
    ROUND((RANDOM() * 100)::numeric, 2)
FROM jobs j
CROSS JOIN (
    VALUES 
        ('gender'),
        ('ethnicity'),
        ('location')
) AS metrics(metric_type)
WHERE j.status = 'published';

-- Update jobs with metrics
UPDATE jobs
SET metrics = jsonb_build_object(
    'applications', jsonb_build_object(
        'value', FLOOR(RANDOM() * 100 + 20),
        'change', ROUND((RANDOM() * 40 - 20)::numeric, 2)
    ),
    'sessionDuration', jsonb_build_object(
        'value', CONCAT(FLOOR(RANDOM() * 5 + 1)::text, 'm ', FLOOR(RANDOM() * 50 + 10)::text, 's'),
        'change', ROUND((RANDOM() * 40 - 20)::numeric, 2)
    ),
    'conversionRate', jsonb_build_object(
        'value', ROUND((RANDOM() * 40 + 10)::numeric, 2),
        'change', ROUND((RANDOM() * 40 - 20)::numeric, 2)
    ),
    'activeJobs', jsonb_build_object(
        'value', FLOOR(RANDOM() * 10 + 1),
        'change', ROUND((RANDOM() * 40 - 20)::numeric, 2)
    )
)
WHERE status = 'published'; 