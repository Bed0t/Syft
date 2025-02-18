import React, { useEffect, useState } from 'react';
import { useAdminAnalytics } from '../../context/adminAnalytics';
import { trackPageView } from '../../lib/analytics';
import { exportData, generateReport } from '../../lib/exportUtils';
import { analyticsCache, CACHE_KEYS, warmCache } from '../../lib/analyticsCache';
import { MetricsChart, MetricsCard, MetricsGrid } from '../../components/analytics/AdvancedCharts';
import {
  Users,
  Building2,
  Brain,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  Activity,
  UserCheck,
  BarChart2,
  PieChart
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics: React.FC = () => {
  const { platformMetrics, userMetrics, aiMetrics, isLoading, refreshMetrics } = useAdminAnalytics();
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json'>('xlsx');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    trackPageView('/admin/analytics');
    warmCache();
  }, []);

  const handleExport = async (type: string) => {
    try {
      let data;
      switch (type) {
        case 'platform':
          data = await analyticsCache.get(CACHE_KEYS.PLATFORM_METRICS) || platformMetrics;
          break;
        case 'users':
          data = await analyticsCache.get(CACHE_KEYS.USER_METRICS) || userMetrics;
          break;
        case 'ai':
          data = await analyticsCache.get(CACHE_KEYS.AI_METRICS) || aiMetrics;
          break;
        case 'all':
          data = {
            platform: platformMetrics,
            users: userMetrics,
            ai: aiMetrics
          };
          break;
        default:
          throw new Error(`Invalid export type: ${type}`);
      }

      if (exportFormat === 'xlsx') {
        const report = await generateReport(data, type);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `syft_analytics_${type}_${timestamp}.xlsx`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(report);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await exportData({
          fileName: `syft_analytics_${type}`,
          format: exportFormat,
          data
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      // TODO: Show error notification
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  // Prepare data for visualizations
  const platformCards = [
    {
      title: 'Total Users',
      value: platformMetrics?.totalUsers || 0,
      change: platformMetrics?.userGrowth.monthly,
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={[
            { name: '30d', users: platformMetrics?.totalUsers || 0 },
            { name: '20d', users: Math.round((platformMetrics?.totalUsers || 0) * 0.8) },
            { name: '10d', users: Math.round((platformMetrics?.totalUsers || 0) * 0.6) }
          ]}
          dataKeys={['users']}
          xAxisKey="name"
          colorScheme="primary"
        />
      )
    },
    {
      title: 'Active Companies',
      value: userMetrics?.activeCompanies || 0,
      change: 12,
      icon: <Building2 className="h-6 w-6 text-green-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={[
            { name: '30d', companies: userMetrics?.activeCompanies || 0 },
            { name: '20d', companies: Math.round((userMetrics?.activeCompanies || 0) * 0.85) },
            { name: '10d', companies: Math.round((userMetrics?.activeCompanies || 0) * 0.7) }
          ]}
          dataKeys={['companies']}
          xAxisKey="name"
          colorScheme="success"
        />
      )
    },
    {
      title: 'Monthly Revenue',
      value: `$${(platformMetrics?.revenue?.mrr || 0).toLocaleString()}`,
      change: platformMetrics?.revenue?.growth,
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={[
            { name: 'Current', revenue: platformMetrics?.revenue?.mrr || 0 },
            { name: '-1m', revenue: (platformMetrics?.revenue?.mrr || 0) * 0.9 },
            { name: '-2m', revenue: (platformMetrics?.revenue?.mrr || 0) * 0.8 }
          ]}
          dataKeys={['revenue']}
          xAxisKey="name"
          colorScheme="warning"
        />
      )
    },
    {
      title: 'AI Success Rate',
      value: `${Math.round(aiMetrics?.accuracy?.overall || 0)}%`,
      change: 5,
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      chart: (
        <MetricsChart
          type="area"
          height={100}
          data={[
            { name: 'Current', rate: aiMetrics?.accuracy?.overall || 0 },
            { name: '-1w', rate: (aiMetrics?.accuracy?.overall || 0) * 0.95 },
            { name: '-2w', rate: (aiMetrics?.accuracy?.overall || 0) * 0.9 }
          ]}
          dataKeys={['rate']}
          xAxisKey="name"
          colorScheme="primary"
        />
      )
    }
  ];

  // Prepare user engagement data
  const userEngagementData = [
    {
      name: 'Daily',
      active: userMetrics?.userEngagement.dailyActiveUsers || 0,
      new: platformMetrics?.userGrowth.daily || 0
    },
    {
      name: 'Weekly',
      active: userMetrics?.userEngagement.weeklyActiveUsers || 0,
      new: platformMetrics?.userGrowth.weekly || 0
    },
    {
      name: 'Monthly',
      active: userMetrics?.userEngagement.monthlyActiveUsers || 0,
      new: platformMetrics?.userGrowth.monthly || 0
    }
  ];

  // Prepare AI performance data
  const aiPerformanceData = Object.entries(aiMetrics?.accuracy.byJobType || {}).map(([type, value]) => ({
    name: type,
    accuracy: value,
    speed: aiMetrics?.processingSpeed.averageScreeningTime || 0
  }));

  // Prepare revenue data
  const revenueData = [
    { name: 'MRR', value: platformMetrics?.revenue.mrr || 0 },
    { name: 'ARR', value: platformMetrics?.revenue.arr || 0 }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Analytics</h1>
          <div className="flex space-x-4">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setSelectedTimeRange('day')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  selectedTimeRange === 'day'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setSelectedTimeRange('week')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedTimeRange === 'week'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setSelectedTimeRange('month')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  selectedTimeRange === 'month'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <div className="px-4 py-2 text-xs text-gray-500">Export Format</div>
                    <button
                      onClick={() => setExportFormat('xlsx')}
                      className={`flex items-center px-4 py-2 text-sm w-full ${
                        exportFormat === 'xlsx' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel (XLSX)
                    </button>
                    <button
                      onClick={() => setExportFormat('csv')}
                      className={`flex items-center px-4 py-2 text-sm w-full ${
                        exportFormat === 'csv' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      CSV
                    </button>
                    <button
                      onClick={() => setExportFormat('json')}
                      className={`flex items-center px-4 py-2 text-sm w-full ${
                        exportFormat === 'json' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="px-4 py-2 text-xs text-gray-500">Export Data</div>
                    <button
                      onClick={() => handleExport('platform')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100"
                    >
                      Platform Metrics
                    </button>
                    <button
                      onClick={() => handleExport('users')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100"
                    >
                      User Metrics
                    </button>
                    <button
                      onClick={() => handleExport('ai')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100"
                    >
                      AI Metrics
                    </button>
                    <button
                      onClick={() => handleExport('all')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100"
                    >
                      All Metrics
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Metrics Cards */}
        <MetricsGrid items={platformCards} />

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* User Engagement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Engagement</h2>
            <MetricsChart
              type="composed"
              height={300}
              data={userEngagementData}
              dataKeys={['active', 'new']}
              xAxisKey="name"
              colorScheme="primary"
            />
          </div>

          {/* AI Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Performance by Job Type</h2>
            <MetricsChart
              type="bar"
              height={300}
              data={aiPerformanceData}
              dataKeys={['accuracy', 'speed']}
              xAxisKey="name"
              colorScheme="success"
            />
          </div>

          {/* Revenue Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h2>
            <MetricsChart
              type="pie"
              height={300}
              data={revenueData}
              dataKeys={['value']}
              xAxisKey="name"
              colorScheme="warning"
            />
          </div>

          {/* User Retention */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Retention</h2>
            <MetricsChart
              type="line"
              height={300}
              data={[
                { day: 'Day 1', rate: userMetrics?.userRetention.day1 || 0 },
                { day: 'Day 7', rate: userMetrics?.userRetention.day7 || 0 },
                { day: 'Day 30', rate: userMetrics?.userRetention.day30 || 0 }
              ]}
              dataKeys={['rate']}
              xAxisKey="day"
              colorScheme="danger"
            />
          </div>
        </div>

        {/* Detailed Metrics Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Performance Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="flex items-center">
                  <Activity className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Processing Speed
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {aiMetrics?.processingSpeed.averageScreeningTime || 0}s
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <UserCheck className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Active Sessions
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {userMetrics?.userEngagement.dailyActiveUsers || 0}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <BarChart2 className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Conversion Rate
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {Math.round(aiMetrics?.usage.successRate || 0)}%
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

export default AdminAnalytics; 