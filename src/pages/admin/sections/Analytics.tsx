import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Clock, Target } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    {
      name: 'User Growth',
      value: '+28%',
      trend: 'up',
      description: 'Compared to last month',
    },
    {
      name: 'Revenue',
      value: '$48,500',
      trend: 'up',
      description: 'Monthly recurring revenue',
    },
    {
      name: 'Churn Rate',
      value: '2.3%',
      trend: 'down',
      description: 'Decreased from last month',
    },
    {
      name: 'Active Users',
      value: '1,234',
      trend: 'up',
      description: 'Currently active users',
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    </dd>
                    <dd className="text-sm text-gray-500">{metric.description}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">User Growth</h2>
          <div className="flex h-64 items-center justify-center text-gray-500">
            [User Growth Chart Placeholder]
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Revenue Trends</h2>
          <div className="flex h-64 items-center justify-center text-gray-500">
            [Revenue Chart Placeholder]
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-8 rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Performance Metrics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-500">Total Users</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">12,345</span>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-500">Average Revenue</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">$89</span>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-500">Avg. Session</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">24m</span>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Target className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-500">Conversion</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">3.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
