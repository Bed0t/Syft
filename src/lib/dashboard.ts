import { supabase, resetUserData } from './supabase';

export interface DashboardStats {
  totalApplications: number;
  timeToHire: number;
  applicationSources: {
    direct: number;
    linkedin: number;
    other: number;
  };
  monthlyApplications: {
    [key: string]: number;
  };
  metrics: {
    applications: {
      value: number;
      change: number;
    };
    sessionDuration: {
      value: string;
      change: number;
    };
    conversionRate: {
      value: number;
      change: number;
    };
    activeJobs: {
      value: number;
      change: number;
    };
  };
}

export const initializeDashboard = async (userId: string): Promise<boolean> => {
  try {
    // Check if user has any jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (jobsError) throw jobsError;

    // If no jobs found, initialize data
    if (!jobs || jobs.length === 0) {
      const { success, error } = await resetUserData(userId);
      if (!success) throw error;
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    return false;
  }
};

export const calculateDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    // First check if we need to initialize
    await initializeDashboard(userId);

    // Get all jobs for the user
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, created_at, status')
      .eq('user_id', userId);

    if (jobsError) throw jobsError;

    // Get all applications for user's jobs
    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select(`
        id,
        created_at,
        status,
        job_id,
        job_board_postings (
          platform
        )
      `)
      .in('job_id', jobs?.map(job => job.id) || []);

    if (applicationsError) throw applicationsError;

    // Calculate total applications
    const totalApplications = applications?.length || 0;

    // Calculate time to hire (average days between application and hire)
    const hiredApplications = applications?.filter(app => app.status === 'hired') || [];
    const timeToHire = hiredApplications.length > 0
      ? hiredApplications.reduce((acc, app) => {
          const applicationDate = new Date(app.created_at);
          const hireDate = new Date(); // This should be replaced with actual hire date when available
          return acc + (hireDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / hiredApplications.length
      : 0;

    // Calculate application sources
    const applicationSources = applications?.reduce((acc, app) => {
      const platform = app.job_board_postings?.platform?.toLowerCase() || 'direct';
      if (platform === 'linkedin') {
        acc.linkedin++;
      } else if (platform === 'direct') {
        acc.direct++;
      } else {
        acc.other++;
      }
      return acc;
    }, { direct: 0, linkedin: 0, other: 0 });

    // Calculate monthly applications
    const monthlyApplications = applications?.reduce((acc, app) => {
      const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate metrics
    const previousMonthStart = new Date();
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    previousMonthStart.setDate(1);

    const currentMonthApplications = applications?.filter(
      app => new Date(app.created_at) >= previousMonthStart
    ).length || 0;

    const previousMonthApplications = applications?.filter(
      app => {
        const date = new Date(app.created_at);
        return date >= new Date(previousMonthStart.getFullYear(), previousMonthStart.getMonth() - 1, 1) &&
               date < previousMonthStart;
      }
    ).length || 0;

    const applicationChange = previousMonthApplications > 0
      ? ((currentMonthApplications - previousMonthApplications) / previousMonthApplications) * 100
      : 0;

    const activeJobs = jobs?.filter(job => job.status === 'published').length || 0;
    const previousActiveJobs = jobs?.filter(
      job => job.status === 'published' && new Date(job.created_at) < previousMonthStart
    ).length || 0;

    return {
      totalApplications,
      timeToHire,
      applicationSources: applicationSources || { direct: 0, linkedin: 0, other: 0 },
      monthlyApplications: monthlyApplications || {},
      metrics: {
        applications: {
          value: currentMonthApplications,
          change: applicationChange
        },
        sessionDuration: {
          value: '2m 18s', // This should be replaced with actual session duration when available
          change: 8
        },
        conversionRate: {
          value: (hiredApplications.length / totalApplications) * 100 || 0,
          change: 2.1
        },
        activeJobs: {
          value: activeJobs,
          change: activeJobs - previousActiveJobs
        }
      }
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    throw error;
  }
}; 