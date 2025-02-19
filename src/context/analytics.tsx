import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './auth';

interface AnalyticsContextType {
  // Dashboard Metrics
  dashboardMetrics: DashboardMetrics | null;
  // Job Metrics
  jobMetrics: Record<string, JobMetrics> | null;
  // Loading States
  isLoading: boolean;
  // Actions
  refreshMetrics: () => Promise<void>;
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  error: Error | null;
}

interface DashboardMetrics {
  jobMetrics: JobMetrics[];
  hiringEfficiency: HiringEfficiency;
  diversityStats: DiversityStats;
  jobBoardPerformance: JobBoardPerformance[];
}

interface JobMetrics {
  totalApplications: number;
  timeToHire: number;
  applicationSources: {
    direct: number;
    linkedin: number;
    other: number;
  };
  monthlyApplications: Record<string, number>;
  metrics: {
    applications: { value: number; change: number };
    sessionDuration: { value: string; change: number };
    conversionRate: { value: number; change: number };
    activeJobs: { value: number; change: number };
  };
}

interface HiringEfficiency {
  averageTimeToHire: number;
  aiRecommendationAccuracy: number;
  stageConversionRates: Record<string, number>;
}

interface DiversityStats {
  gender: Record<string, number>;
  ethnicity: Record<string, number>;
  location: Record<string, number>;
}

interface JobBoardPerformance {
  boardName: string;
  views: number;
  applications: number;
  costPerHire: number;
  hireRate: number;
}

interface AnalyticsEvent {
  eventType: string;
  eventData: Record<string, any>;
  sessionId: string;
  pageUrl: string;
  clientMetadata: {
    userAgent: string;
    screenSize: string;
    timezone: string;
  };
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [jobMetrics, setJobMetrics] = useState<Record<string, JobMetrics> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshMetrics = async () => {
    if (!user) {
      console.log('No user found, skipping metrics refresh');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching dashboard metrics for user:', user.id);
      
      // Fetch dashboard metrics using the stored procedure
      const { data: metrics, error: metricsError } = await supabase
        .rpc('get_user_dashboard_metrics', { p_user_id: user.id });

      if (metricsError) {
        console.error('Error fetching dashboard metrics:', metricsError);
        throw metricsError;
      }

      if (!metrics) {
        console.warn('No metrics data returned from the database');
        setDashboardMetrics(null);
        return;
      }

      console.log('Received metrics data:', metrics);
      setDashboardMetrics(metrics);

      // Fetch individual job metrics
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, metrics')
        .eq('user_id', user.id);

      if (jobsError) {
        console.error('Error fetching job metrics:', jobsError);
        throw jobsError;
      }

      const jobMetricsMap = jobs.reduce((acc, job) => ({
        ...acc,
        [job.id]: job.metrics
      }), {});

      setJobMetrics(jobMetricsMap);
    } catch (err) {
      console.error('Error in refreshMetrics:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      setDashboardMetrics(null);
      setJobMetrics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = async (event: AnalyticsEvent) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          user_id: user.id,
          ...event
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Helper functions for data transformation
  const calculateAverageTimeToHire = (metrics: any[]): number => {
    if (!metrics?.length) return 0;
    return metrics.reduce((acc, m) => acc + (m.avg_time_in_stage || 0), 0) / metrics.length;
  };

  const calculateAIAccuracy = (metrics: any[]): number => {
    if (!metrics?.length) return 0;
    const aiRecommended = metrics.filter(m => m.ai_recommended).length;
    const aiHired = metrics.filter(m => m.ai_recommended && m.status === 'hired').length;
    return aiHired / aiRecommended || 0;
  };

  const calculateStageConversion = (metrics: any[]): Record<string, number> => {
    if (!metrics?.length) return {};
    return metrics.reduce((acc, m) => ({
      ...acc,
      [m.stage]: m.conversion_rate || 0
    }), {});
  };

  const transformDiversityStats = (stats: any[]): DiversityStats => {
    if (!stats?.length) return { gender: {}, ethnicity: {}, location: {} };
    return stats.reduce((acc, stat) => {
      const category = stat.metric_type.toLowerCase();
      if (['gender', 'ethnicity', 'location'].includes(category)) {
        acc[category as keyof DiversityStats] = {
          ...acc[category as keyof DiversityStats],
          ...stat.demographic_data
        };
      }
      return acc;
    }, { gender: {}, ethnicity: {}, location: {} });
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      refreshMetrics();
    }
  }, [user]);

  return (
    <AnalyticsContext.Provider value={{
      dashboardMetrics,
      jobMetrics,
      isLoading,
      error,
      refreshMetrics,
      trackEvent
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}; 