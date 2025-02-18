import React, { useEffect } from 'react';
import { useAdminAnalytics } from '../../context/adminAnalytics';
import { trackPageView } from '../../lib/analytics';
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
  Download
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics: React.FC = () => {
  const { platformMetrics, userMetrics, aiMetrics, isLoading, exportAnalytics } = useAdminAnalytics();

  useEffect(() => {
    trackPageView('/admin/analytics');
  }, []);

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
            <button
              onClick={() => exportAnalytics('platform')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
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