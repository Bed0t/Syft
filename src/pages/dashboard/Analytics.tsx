import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Target, Award } from 'lucide-react';
import { useAnalytics } from '../../context/analytics';
import { trackPageView } from '../../lib/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics: React.FC = () => {
  const { dashboardMetrics, isLoading, refreshMetrics } = useAnalytics();

  useEffect(() => {
    trackPageView('/dashboard/analytics');
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  const metrics = [
    {
      name: 'Time to Hire',
      value: `${Math.round(dashboardMetrics?.hiringEfficiency.averageTimeToHire || 0)} days`,
      change: dashboardMetrics?.jobMetrics[0]?.metrics.applications.change + '%' || '0%',
      trend: (dashboardMetrics?.jobMetrics[0]?.metrics.applications.change || 0) > 0 ? 'up' : 'down',
      description: 'Average time from job posting to offer acceptance',
    },
    {
      name: 'AI Success Rate',
      value: `${Math.round(dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0)}%`,
      change: '+12%',
      trend: 'up',
      description: 'Candidates who pass AI interview stage',
    },
    {
      name: 'Conversion Rate',
      value: `${Math.round(dashboardMetrics?.jobMetrics[0]?.metrics.conversionRate.value || 0)}%`,
      change: dashboardMetrics?.jobMetrics[0]?.metrics.conversionRate.change + '%' || '0%',
      trend: (dashboardMetrics?.jobMetrics[0]?.metrics.conversionRate.change || 0) > 0 ? 'up' : 'down',
      description: 'Application to hire conversion rate',
    },
    {
      name: 'Active Jobs',
      value: dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.value.toString() || '0',
      change: dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.change + '%' || '0%',
      trend: (dashboardMetrics?.jobMetrics[0]?.metrics.activeJobs.change || 0) > 0 ? 'up' : 'down',
      description: 'Currently active job postings',
    },
  ];

  const hiringPipelineData = Object.entries(dashboardMetrics?.hiringEfficiency.stageConversionRates || {})
    .map(([stage, rate]) => ({
      stage,
      rate: Math.round(rate)
    }));

  const sourceQualityData = dashboardMetrics?.jobBoardPerformance.map(board => ({
    name: board.boardName,
    value: board.hireRate
  })) || [];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>

        {/* Key Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">{metric.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{metric.value}</div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {metric.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">{metric.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Hiring Pipeline */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Hiring Pipeline</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringPipelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Quality */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Source Quality</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceQualityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceQualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Detailed Metrics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Total Applications</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics?.jobMetrics[0]?.totalApplications || 0}
                  </span>
                  <span className="ml-2 text-sm text-green-600">
                    {dashboardMetrics?.jobMetrics[0]?.metrics.applications.change}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Average Session Time
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {dashboardMetrics?.jobMetrics[0]?.metrics.sessionDuration.value}
                  </span>
                  <span className="ml-2 text-sm text-green-600">
                    {dashboardMetrics?.jobMetrics[0]?.metrics.sessionDuration.change}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Target className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">AI Match Rate</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {Math.round(dashboardMetrics?.hiringEfficiency.aiRecommendationAccuracy || 0)}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Diversity Score</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {Object.keys(dashboardMetrics?.diversityStats.gender || {}).length}/5
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
