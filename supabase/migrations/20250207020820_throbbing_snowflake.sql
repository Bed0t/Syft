/*
  # Add Real-Time Analytics Functions and Triggers

  1. New Functions
    - track_job_view: Records job views in real-time
    - track_job_click: Records job clicks/interactions
    - update_source_analytics: Updates source-specific metrics
    - aggregate_daily_analytics: Aggregates analytics data

  2. Security
    - Functions run with security definer
    - Access controlled through RLS policies

  3. Changes
    - Add real-time tracking capabilities
    - Enable source attribution
    - Add aggregation functions
*/

-- Function to track job views
CREATE OR REPLACE FUNCTION public.track_job_view(
  job_id uuid,
  source text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update analytics for the current date
  INSERT INTO job_analytics (job_id, date, views, source_breakdown)
  VALUES (
    job_id,
    CURRENT_DATE,
    1,
    CASE 
      WHEN source IS NOT NULL THEN 
        jsonb_build_object(source, jsonb_build_object('views', 1))
      ELSE '{}'::jsonb
    END
  )
  ON CONFLICT (job_id, date)
  DO UPDATE SET
    views = job_analytics.views + 1,
    source_breakdown = CASE 
      WHEN source IS NOT NULL THEN
        COALESCE(job_analytics.source_breakdown, '{}'::jsonb) || 
        jsonb_build_object(
          source,
          jsonb_build_object(
            'views',
            (COALESCE((job_analytics.source_breakdown->source->>'views')::int, 0) + 1)
          )
        )
      ELSE job_analytics.source_breakdown
    END,
    updated_at = now();
END;
$$;

-- Function to track job clicks/interactions
CREATE OR REPLACE FUNCTION public.track_job_click(
  job_id uuid,
  source text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update analytics for the current date
  INSERT INTO job_analytics (job_id, date, clicks, source_breakdown)
  VALUES (
    job_id,
    CURRENT_DATE,
    1,
    CASE 
      WHEN source IS NOT NULL THEN 
        jsonb_build_object(source, jsonb_build_object('clicks', 1))
      ELSE '{}'::jsonb
    END
  )
  ON CONFLICT (job_id, date)
  DO UPDATE SET
    clicks = job_analytics.clicks + 1,
    source_breakdown = CASE 
      WHEN source IS NOT NULL THEN
        COALESCE(job_analytics.source_breakdown, '{}'::jsonb) || 
        jsonb_build_object(
          source,
          jsonb_build_object(
            'clicks',
            (COALESCE((job_analytics.source_breakdown->source->>'clicks')::int, 0) + 1)
          )
        )
      ELSE job_analytics.source_breakdown
    END,
    updated_at = now();
END;
$$;

-- Function to update source-specific analytics
CREATE OR REPLACE FUNCTION public.update_source_analytics(
  job_id uuid,
  source text,
  metric text,
  increment integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update analytics for the current date
  INSERT INTO job_analytics (job_id, date, source_breakdown)
  VALUES (
    job_id,
    CURRENT_DATE,
    jsonb_build_object(
      source,
      jsonb_build_object(metric, increment)
    )
  )
  ON CONFLICT (job_id, date)
  DO UPDATE SET
    source_breakdown = COALESCE(job_analytics.source_breakdown, '{}'::jsonb) || 
      jsonb_build_object(
        source,
        jsonb_build_object(
          metric,
          (COALESCE((job_analytics.source_breakdown->source->>metric)::int, 0) + increment)
        )
      ),
    updated_at = now();
END;
$$;

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics(
  start_date date DEFAULT CURRENT_DATE - interval '30 days',
  end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  job_id uuid,
  total_views bigint,
  total_clicks bigint,
  total_applications bigint,
  total_interviews bigint,
  total_offers bigint,
  conversion_rate numeric,
  source_performance jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.job_id,
    SUM(a.views) as total_views,
    SUM(a.clicks) as total_clicks,
    SUM(a.applications) as total_applications,
    SUM(a.interviews_completed) as total_interviews,
    SUM(a.offers_sent) as total_offers,
    CASE 
      WHEN SUM(a.views) > 0 THEN 
        ROUND((SUM(a.applications)::numeric / SUM(a.views)::numeric) * 100, 2)
      ELSE 0 
    END as conversion_rate,
    jsonb_object_agg(
      DISTINCT source,
      jsonb_build_object(
        'views', SUM((a.source_breakdown->source->>'views')::int),
        'clicks', SUM((a.source_breakdown->source->>'clicks')::int),
        'applications', SUM((a.source_breakdown->source->>'applications')::int)
      )
    ) as source_performance
  FROM 
    job_analytics a,
    jsonb_object_keys(a.source_breakdown) source
  WHERE 
    a.date BETWEEN start_date AND end_date
  GROUP BY 
    a.job_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.track_job_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_job_click TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_source_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION public.aggregate_daily_analytics TO authenticated;

-- Function to track job board posting metrics
CREATE OR REPLACE FUNCTION public.track_job_board_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update analytics when metrics change
  IF TG_OP = 'UPDATE' AND NEW.metrics IS DISTINCT FROM OLD.metrics THEN
    PERFORM update_source_analytics(
      NEW.job_id,
      NEW.board_name,
      metric_key,
      (NEW.metrics->>metric_key)::int - COALESCE((OLD.metrics->>metric_key)::int, 0)
    )
    FROM jsonb_object_keys(NEW.metrics) metric_key;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for job board metrics
CREATE TRIGGER track_job_board_metrics_changes
  AFTER UPDATE ON job_board_postings
  FOR EACH ROW
  EXECUTE FUNCTION track_job_board_metrics();