import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './auth';

interface AdminAnalyticsContextType {
  platformMetrics: PlatformMetrics | null;
  userMetrics: UserMetrics | null;
  aiMetrics: AIMetrics | null;
  isLoading: boolean;
  refreshMetrics: () => Promise<void>;
  exportAnalytics: (type: string) => Promise<void>;
}

interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  totalApplications: number;
  revenue: {
    mrr: number;
    arr: number;
    growth: number;
  };
  userGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  churnRate: number;
}

interface UserMetrics {
  activeCompanies: number;
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: string;
  };
  subscriptionTiers: Record<string, number>;
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
}

interface AIMetrics {
  accuracy: {
    overall: number;
    byJobType: Record<string, number>;
  };
  processingSpeed: {
    averageScreeningTime: number;
    averageMatchingTime: number;
  };
  usage: {
    totalScreenings: number;
    totalMatches: number;
    successRate: number;
  };
}

const AdminAnalyticsContext = createContext<AdminAnalyticsContextType | undefined>(undefined);

export const AdminAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [aiMetrics, setAIMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMetrics = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch platform-wide metrics
      const { data: platform, error: platformError } = await supabase
        .rpc('get_platform_metrics');

      if (platformError) throw platformError;

      setPlatformMetrics(platform);

      // Fetch user metrics
      const { data: users, error: usersError } = await supabase
        .rpc('get_user_metrics');

      if (usersError) throw usersError;

      setUserMetrics(users);

      // Fetch AI metrics
      const { data: ai, error: aiError } = await supabase
        .rpc('get_ai_metrics');

      if (aiError) throw aiError;

      setAIMetrics(ai);
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAnalytics = async (type: string) => {
    if (!user) return;

    try {
      let data;
      switch (type) {
        case 'platform':
          data = platformMetrics;
          break;
        case 'users':
          data = userMetrics;
          break;
        case 'ai':
          data = aiMetrics;
          break;
        default:
          data = {
            platform: platformMetrics,
            users: userMetrics,
            ai: aiMetrics
          };
      }

      // Generate CSV
      const csvContent = generateCSV(data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `syft_analytics_${type}_${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  const generateCSV = (data: any): string => {
    const headers = Object.keys(data);
    const rows = [headers];
    
    const values = headers.map(header => {
      const value = data[header];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    });
    
    rows.push(values);
    
    return rows.map(row => row.join(',')).join('\n');
  };

  useEffect(() => {
    if (user) {
      refreshMetrics();
    }
  }, [user]);

  return (
    <AdminAnalyticsContext.Provider value={{
      platformMetrics,
      userMetrics,
      aiMetrics,
      isLoading,
      refreshMetrics,
      exportAnalytics
    }}>
      {children}
    </AdminAnalyticsContext.Provider>
  );
};

export const useAdminAnalytics = () => {
  const context = useContext(AdminAnalyticsContext);
  if (context === undefined) {
    throw new Error('useAdminAnalytics must be used within an AdminAnalyticsProvider');
  }
  return context;
}; 