import React, { useEffect, useState } from 'react';
import { useAdminAnalytics } from '../../context/adminAnalytics';
import { trackPageView } from '../../lib/analytics';
import { exportData, generateReport } from '../../lib/exportUtils';
import { analyticsCache, CACHE_KEYS, warmCache } from '../../lib/analyticsCache';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
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
  FileText
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics: React.FC = () => {
  const { platformMetrics, userMetrics, aiMetrics, isLoading, refreshMetrics } = useAdminAnalytics();
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json'>('xlsx');
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    trackPageView('/admin/analytics');
    warmCache(); // Pre-warm the cache
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

  const platformCards = [
    {
      title: 'Total Users',
      value: platformMetrics?.totalUsers || 0,
      change: platformMetrics?.userGrowth.monthly || 0,
      icon: Users
    },
    {
      title: 'Active Companies',
      value: userMetrics?.activeCompanies || 0,
      change: 0,
      icon: Building2
    },
    {
      title: 'MRR',
      value: `$${(platformMetrics?.revenue.mrr || 0).toLocaleString()}`,
      change: platformMetrics?.revenue.growth || 0,
      icon: DollarSign
    },
    {
      title: 'AI Success Rate',
      value: `${Math.round(aiMetrics?.accuracy.overall || 0)}%`,
      change: 0,
      icon: Brain
    }
  ];

  const retentionData = [
    { name: 'Day 1', value: userMetrics?.userRetention.day1 || 0 },
    { name: 'Day 7', value: userMetrics?.userRetention.day7 || 0 },
    { name: 'Day 30', value: userMetrics?.userRetention.day30 || 0 }
  ];

  const aiAccuracyData = Object.entries(aiMetrics?.accuracy.byJobType || {}).map(([type, value]) => ({
    name: type,
    value
  }));

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Analytics</h1>
          <div className="flex space-x-4">
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

        {/* Platform Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {platformCards.map((card) => (
            <div key={card.title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <card.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                        {card.change !== 0 && (
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              card.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {card.change > 0 ? '+' : ''}{card.change}%
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* User Retention */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900">User Retention</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4F46E5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Accuracy by Job Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900">AI Accuracy by Job Type</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiAccuracyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {aiAccuracyData.map((entry, index) => (
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
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">AI Performance Metrics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Avg. Screening Time
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
                  <Target className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Total Screenings
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {aiMetrics?.usage.totalScreenings || 0}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Success Rate
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