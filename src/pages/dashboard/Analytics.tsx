import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../context/analytics';
import { trackPageView } from '../../lib/analytics';
import { MetricsChart, MetricsCard, MetricsGrid } from '../../components/analytics/AdvancedCharts';
import {
  Briefcase,
  Users,
  Target,
  Clock,
  TrendingUp,
  Award,
  Building,
  Brain
} from 'lucide-react';

// Add type definitions
interface JobMetric {
  stage: string;
  metrics: {
    activeJobs: {
      value: number;
      change: number;
    };
    applications: {
      value: number;
      change: number;
    };
    conversionRate: {
      value: number;
      change: number;
    };
    sessionDuration: {
      value: string;
      change: number;
    };
  };
  totalApplications: number;
  monthlyApplications: Array<{
    month: string;
    applications: number;
  }>;
  applicationSources: Record<string, number>;
}

const Analytics: React.FC = () => {
  const { dashboardMetrics, jobMetrics, isLoading, refreshMetrics } = useAnalytics();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    trackPageView('/dashboard/analytics');
    refreshMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  // Update the metrics cards data preparation
  const metricsCards = [
    {
      title: 'Active Jobs',
      value: dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.value || 0,
      change: dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.change,
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={[
            { name: 'Current', jobs: dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.value || 0 },
            { name: 'Previous', jobs: (dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.value || 0) * 0.8 }
          ]}
          dataKeys={['jobs']}
          xAxisKey="name"
          colorScheme="primary"
        />
      )
    },
    {
      title: 'Total Applications',
      value: dashboardMetrics?.jobMetrics[0]?.totalApplications || 0,
      change: dashboardMetrics?.jobMetrics[0]?.metrics.applications.change,
      icon: <Users className="h-6 w-6 text-green-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={
            Array.isArray(dashboardMetrics?.jobMetrics[0]?.monthlyApplications)
              ? dashboardMetrics?.jobMetrics[0]?.monthlyApplications
              : [
                  { month: 'Current', applications: dashboardMetrics?.jobMetrics[0]?.totalApplications || 0 },
                  { month: 'Previous', applications: (dashboardMetrics?.jobMetrics[0]?.totalApplications || 0) * 0.8 }
                ]
          }
          dataKeys={['applications']}
          xAxisKey="month"
          colorScheme="success"
        />
      )
    },
    {
      title: 'Time to Hire',
      value: `${Math.round(dashboardMetrics?.hiringEfficiency.averageTimeToHire || 0)} days`,
      change: -5,
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      chart: (
        <MetricsChart
          type="line"
          height={100}
          data={[
            { name: 'Previous', value: (dashboardMetrics?.hiringEfficiency.averageTimeToHire || 0) * 1.05 },
            { name: 'Current', value: dashboardMetrics?.hiringEfficiency.averageTimeToHire || 0 }
          ]}
          dataKeys={['value']}
          xAxisKey="name"
          colorScheme="warning"
        />
      )
    },
    {
      title: 'AI Match Rate',
      value: `${Math.round(dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0)}%`,
      change: 8,
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={[
            { name: 'Previous', value: (dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0) * 0.92 },
            { name: 'Current', value: dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0 }
          ]}
          dataKeys={['value']}
          xAxisKey="name"
          colorScheme="primary"
        />
      )
    }
  ];

  // Update the AI performance data
  const aiPerformanceData = [
    {
      stage: 'Screening',
      accuracy: Number(dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0),
      speed: typeof dashboardMetrics?.jobMetrics[0]?.metrics.sessionDuration.value === 'string' 
        ? parseFloat(dashboardMetrics?.jobMetrics[0]?.metrics.sessionDuration.value) || 0
        : 0
    },
    {
      stage: 'Matching',
      accuracy: Number(dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0) * 0.9,
      speed: typeof dashboardMetrics?.jobMetrics[0]?.metrics.sessionDuration.value === 'string'
        ? (parseFloat(dashboardMetrics?.jobMetrics[0]?.metrics.sessionDuration.value) || 0) * 1.2
        : 0
    }
  ];

  // Prepare hiring funnel data
  const hiringFunnelData = dashboardMetrics?.hiringEfficiency.stageConversionRates || {};
  const funnelData = Object.entries(hiringFunnelData).map(([stage, rate]) => ({
    stage,
    rate: Math.round(rate as number)
  }));

  // Prepare source performance data
  const sourceData = Object.entries(dashboardMetrics?.jobMetrics[0]?.applicationSources || {}).map(([source, count]) => ({
    name: source,
    applications: count
  }));

  // Prepare diversity data
  const diversityData = Object.entries(dashboardMetrics?.diversityStats.gender || {}).map(([category, percentage]) => ({
    category,
    percentage
  }));

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setSelectedTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                selectedTimeRange === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedTimeRange === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedTimeRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                selectedTimeRange === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
            </div>
        </div>

        {/* Metrics Cards */}
        <MetricsGrid items={metricsCards} />

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Hiring Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Hiring Funnel</h2>
            <MetricsChart
              type="bar"
              height={300}
              data={funnelData}
              dataKeys={['rate']}
              xAxisKey="stage"
              colorScheme="primary"
            />
              </div>

          {/* Application Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Sources</h2>
            <MetricsChart
              type="pie"
              height={300}
              data={sourceData}
              dataKeys={['applications']}
              xAxisKey="name"
              colorScheme="success"
            />
            </div>

          {/* Diversity Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Diversity Statistics</h2>
            <MetricsChart
              type="bar"
              height={300}
              data={diversityData}
              dataKeys={['percentage']}
              xAxisKey="category"
              colorScheme="warning"
            />
          </div>

          {/* AI Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Performance</h2>
            <MetricsChart
              type="composed"
              height={300}
              data={aiPerformanceData}
              dataKeys={['accuracy', 'speed']}
              xAxisKey="stage"
              colorScheme="danger"
            />
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Performance Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="flex items-center">
                  <Target className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Conversion Rate
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics?.jobMetrics[0]?.metrics.conversionRate.value || 0}%
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    from applications to hires
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Quality of Hire
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {Math.round((dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0) * 0.95)}%
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    based on AI recommendations
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Building className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Active Positions
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.value || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    across departments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
