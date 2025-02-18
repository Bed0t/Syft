-- Platform-wide metrics function
CREATE OR REPLACE FUNCTION get_platform_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    WITH monthly_stats AS (
        SELECT
            COUNT(DISTINCT u.id) as total_users,
            COUNT(DISTINCT CASE WHEN u.last_sign_in_at >= NOW() - INTERVAL '30 days' THEN u.id END) as active_users,
            COUNT(DISTINCT j.id) as total_jobs,
            COUNT(DISTINCT ja.id) as total_applications,
            COALESCE(SUM(CASE WHEN s.status = 'active' THEN s.amount END), 0) as mrr,
            COALESCE(SUM(CASE WHEN s.status = 'active' THEN s.amount * 12 END), 0) as arr,
            ROUND(
                (COUNT(DISTINCT CASE WHEN u.created_at >= NOW() - INTERVAL '30 days' THEN u.id END)::numeric /
                NULLIF(COUNT(DISTINCT CASE WHEN u.created_at >= NOW() - INTERVAL '60 days' AND u.created_at < NOW() - INTERVAL '30 days' THEN u.id END), 0) - 1) * 100,
                2
            ) as monthly_growth
        FROM auth.users u
        LEFT JOIN jobs j ON j.user_id = u.id
        LEFT JOIN job_applications ja ON ja.job_id = j.id
        LEFT JOIN subscriptions s ON s.user_id = u.id
    ),
    user_growth AS (
        SELECT
            ROUND(
                (COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN id END)::numeric /
                NULLIF(COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '2 days' AND created_at < NOW() - INTERVAL '1 day' THEN id END), 0) - 1) * 100,
                2
            ) as daily,
            ROUND(
                (COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN id END)::numeric /
                NULLIF(COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days' THEN id END), 0) - 1) * 100,
                2
            ) as weekly,
            ROUND(
                (COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN id END)::numeric /
                NULLIF(COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days' THEN id END), 0) - 1) * 100,
                2
            ) as monthly
        FROM auth.users
    ),
    churn_rate AS (
        SELECT
            ROUND(
                (COUNT(DISTINCT CASE WHEN s.status = 'cancelled' AND s.cancelled_at >= NOW() - INTERVAL '30 days' THEN s.user_id END)::numeric /
                NULLIF(COUNT(DISTINCT CASE WHEN s.status = 'active' OR (s.status = 'cancelled' AND s.cancelled_at >= NOW() - INTERVAL '30 days') THEN s.user_id END), 0) * 100),
                2
            ) as monthly_churn
        FROM subscriptions s
    )
    SELECT json_build_object(
        'totalUsers', ms.total_users,
        'activeUsers', ms.active_users,
        'totalJobs', ms.total_jobs,
        'totalApplications', ms.total_applications,
        'revenue', json_build_object(
            'mrr', ms.mrr,
            'arr', ms.arr,
            'growth', ms.monthly_growth
        ),
        'userGrowth', json_build_object(
            'daily', ug.daily,
            'weekly', ug.weekly,
            'monthly', ug.monthly
        ),
        'churnRate', cr.monthly_churn
    ) INTO result
    FROM monthly_stats ms
    CROSS JOIN user_growth ug
    CROSS JOIN churn_rate cr;

    RETURN result;
END;
$$;

-- User metrics function
CREATE OR REPLACE FUNCTION get_user_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    WITH user_engagement AS (
        SELECT
            COUNT(DISTINCT CASE WHEN last_sign_in_at >= NOW() - INTERVAL '1 day' THEN id END) as daily_active,
            COUNT(DISTINCT CASE WHEN last_sign_in_at >= NOW() - INTERVAL '7 days' THEN id END) as weekly_active,
            COUNT(DISTINCT CASE WHEN last_sign_in_at >= NOW() - INTERVAL '30 days' THEN id END) as monthly_active,
            ROUND(AVG(EXTRACT(EPOCH FROM (last_sign_in_at - created_at))/3600)::numeric, 2) as avg_session_hours
        FROM auth.users
    ),
    subscription_breakdown AS (
        SELECT
            tier,
            COUNT(*) as count
        FROM subscriptions
        WHERE status = 'active'
        GROUP BY tier
    ),
    retention_rates AS (
        SELECT
            ROUND(
                COUNT(DISTINCT CASE WHEN last_sign_in_at >= created_at + INTERVAL '1 day' THEN id END)::numeric /
                NULLIF(COUNT(DISTINCT id), 0) * 100,
                2
            ) as day_1,
            ROUND(
                COUNT(DISTINCT CASE WHEN last_sign_in_at >= created_at + INTERVAL '7 days' THEN id END)::numeric /
                NULLIF(COUNT(DISTINCT id), 0) * 100,
                2
            ) as day_7,
            ROUND(
                COUNT(DISTINCT CASE WHEN last_sign_in_at >= created_at + INTERVAL '30 days' THEN id END)::numeric /
                NULLIF(COUNT(DISTINCT id), 0) * 100,
                2
            ) as day_30
        FROM auth.users
        WHERE created_at <= NOW() - INTERVAL '30 days'
    )
    SELECT json_build_object(
        'activeCompanies', (SELECT COUNT(DISTINCT user_id) FROM jobs WHERE status = 'published'),
        'userEngagement', json_build_object(
            'dailyActiveUsers', ue.daily_active,
            'weeklyActiveUsers', ue.weekly_active,
            'monthlyActiveUsers', ue.monthly_active,
            'averageSessionDuration', ue.avg_session_hours || 'h'
        ),
        'subscriptionTiers', (
            SELECT json_object_agg(tier, count)
            FROM subscription_breakdown
        ),
        'userRetention', json_build_object(
            'day1', r.day_1,
            'day7', r.day_7,
            'day30', r.day_30
        )
    ) INTO result
    FROM user_engagement ue
    CROSS JOIN retention_rates r;

    RETURN result;
END;
$$;

-- AI metrics function
CREATE OR REPLACE FUNCTION get_ai_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    WITH ai_accuracy AS (
        SELECT
            ROUND(
                COUNT(CASE WHEN ja.status = 'hired' AND ja.ai_recommended THEN 1 END)::numeric /
                NULLIF(COUNT(CASE WHEN ja.ai_recommended THEN 1 END), 0) * 100,
                2
            ) as overall_accuracy,
            j.type as job_type,
            ROUND(
                COUNT(CASE WHEN ja.status = 'hired' AND ja.ai_recommended THEN 1 END)::numeric /
                NULLIF(COUNT(CASE WHEN ja.ai_recommended THEN 1 END), 0) * 100,
                2
            ) as type_accuracy
        FROM job_applications ja
        JOIN jobs j ON j.id = ja.job_id
        WHERE ja.ai_recommended IS NOT NULL
        GROUP BY j.type
    ),
    processing_metrics AS (
        SELECT
            ROUND(AVG(ja.screening_time)::numeric, 2) as avg_screening_time,
            ROUND(AVG(
                EXTRACT(EPOCH FROM (ja.updated_at - ja.created_at))
            )::numeric, 2) as avg_matching_time
        FROM job_applications ja
        WHERE ja.ai_recommended IS NOT NULL
    ),
    usage_stats AS (
        SELECT
            COUNT(*) as total_screenings,
            COUNT(CASE WHEN ai_recommended THEN 1 END) as total_matches,
            ROUND(
                COUNT(CASE WHEN status = 'hired' THEN 1 END)::numeric /
                NULLIF(COUNT(*), 0) * 100,
                2
            ) as success_rate
        FROM job_applications
        WHERE ai_recommended IS NOT NULL
    )
    SELECT json_build_object(
        'accuracy', json_build_object(
            'overall', (SELECT MAX(overall_accuracy) FROM ai_accuracy),
            'byJobType', (
                SELECT json_object_agg(job_type, type_accuracy)
                FROM ai_accuracy
                WHERE type_accuracy IS NOT NULL
            )
        ),
        'processingSpeed', json_build_object(
            'averageScreeningTime', pm.avg_screening_time,
            'averageMatchingTime', pm.avg_matching_time
        ),
        'usage', json_build_object(
            'totalScreenings', us.total_screenings,
            'totalMatches', us.total_matches,
            'successRate', us.success_rate
        )
    ) INTO result
    FROM processing_metrics pm
    CROSS JOIN usage_stats us;

    RETURN result;
END;
$$; 