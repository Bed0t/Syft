import { supabase } from './supabase';

// Session Management
let currentSession: string | null = null;

export const initializeSession = () => {
  currentSession = crypto.randomUUID();
  return currentSession;
};

export const getCurrentSession = () => {
  if (!currentSession) {
    return initializeSession();
  }
  return currentSession;
};

// Device Info
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform
  };
};

// Event Tracking
export const trackPageView = async (pageUrl: string) => {
  const sessionId = getCurrentSession();
  const deviceInfo = getDeviceInfo();

  return await supabase
    .from('analytics_events')
    .insert([{
      event_type: 'page_view',
      event_data: { url: pageUrl },
      session_id: sessionId,
      page_url: pageUrl,
      client_metadata: deviceInfo
    }]);
};

export const trackJobView = async (jobId: string) => {
  const sessionId = getCurrentSession();
  
  return await supabase
    .from('analytics_events')
    .insert([{
      event_type: 'job_view',
      event_data: { job_id: jobId },
      session_id: sessionId,
      client_metadata: getDeviceInfo()
    }]);
};

export const trackApplicationSubmit = async (jobId: string, applicationId: string) => {
  const sessionId = getCurrentSession();
  
  return await supabase
    .from('analytics_events')
    .insert([{
      event_type: 'application_submit',
      event_data: { 
        job_id: jobId,
        application_id: applicationId
      },
      session_id: sessionId,
      client_metadata: getDeviceInfo()
    }]);
};

// Metrics Calculation
export const calculateTimeToHire = (applications: any[]) => {
  const hiredApplications = applications.filter(app => app.status === 'hired');
  if (hiredApplications.length === 0) return 0;

  return hiredApplications.reduce((acc, app) => {
    const applicationDate = new Date(app.created_at);
    const hireDate = new Date(app.updated_at);
    return acc + (hireDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24);
  }, 0) / hiredApplications.length;
};

export const calculateConversionRate = (applications: any[], stage: string) => {
  if (applications.length === 0) return 0;
  
  const stageApplications = applications.filter(app => app.status === stage);
  return (stageApplications.length / applications.length) * 100;
};

export const calculateAIEfficiency = (applications: any[]) => {
  const aiRecommended = applications.filter(app => app.ai_recommended);
  if (aiRecommended.length === 0) return 0;

  const aiRecommendedHired = aiRecommended.filter(app => app.status === 'hired');
  return (aiRecommendedHired.length / aiRecommended.length) * 100;
};

// Job Board Analytics
export const calculateJobBoardMetrics = (applications: any[]) => {
  const metrics: Record<string, {
    views: number;
    applications: number;
    hires: number;
    costPerHire: number;
  }> = {};

  applications.forEach(app => {
    const source = app.source || 'direct';
    if (!metrics[source]) {
      metrics[source] = {
        views: 0,
        applications: 1,
        hires: app.status === 'hired' ? 1 : 0,
        costPerHire: 0
      };
    } else {
      metrics[source].applications++;
      if (app.status === 'hired') {
        metrics[source].hires++;
      }
    }
  });

  return metrics;
};

// Diversity Analytics
export const calculateDiversityMetrics = (applications: any[]) => {
  const metrics = {
    gender: {} as Record<string, number>,
    ethnicity: {} as Record<string, number>,
    location: {} as Record<string, number>
  };

  applications.forEach(app => {
    if (app.diversity_data) {
      const { gender, ethnicity, location } = app.diversity_data;
      
      if (gender) {
        metrics.gender[gender] = (metrics.gender[gender] || 0) + 1;
      }
      
      if (ethnicity) {
        metrics.ethnicity[ethnicity] = (metrics.ethnicity[ethnicity] || 0) + 1;
      }
      
      if (location) {
        metrics.location[location] = (metrics.location[location] || 0) + 1;
      }
    }
  });

  return metrics;
};

// Performance Analytics
export const calculatePerformanceMetrics = async (jobId: string) => {
  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('event_data->job_id', jobId);

  if (!events) return null;

  const pageViews = events.filter(e => e.event_type === 'page_view').length;
  const applications = events.filter(e => e.event_type === 'application_submit').length;
  const conversionRate = applications > 0 ? (applications / pageViews) * 100 : 0;

  return {
    pageViews,
    applications,
    conversionRate
  };
}; 