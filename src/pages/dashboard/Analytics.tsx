import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Target, Award } from 'lucide-react';

const metrics = [
  {
    name: 'Time to Hire',
    value: '18 days',
    change: '-28%',
    trend: 'down',
    description: 'Average time from job posting to offer acceptance',
  },
  {
    name: 'Interview Success Rate',
    value: '72%',
    change: '+12%',
    trend: 'up',
    description: 'Candidates who pass AI interview stage',
  },
  {
    name: 'Candidate Quality Score',
    value: '8.4/10',
    change: '+5%',
    trend: 'up',
    description: 'Average AI-assessed candidate quality rating',
  },
  {
    name: 'Cost per Hire',
    value: '$3,200',
    change: '-15%',
    trend: 'down',
    description: 'Average cost of hiring a new employee',
  },
];

const Analytics: React.FC = () => {
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
            <div className="mt-4">
              <div className="flex h-64 items-center justify-center text-gray-500">
                [Hiring Pipeline Chart Placeholder]
              </div>
            </div>
          </div>

          {/* Source Quality */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Source Quality</h2>
            <div className="mt-4">
              <div className="flex h-64 items-center justify-center text-gray-500">
                [Source Quality Chart Placeholder]
              </div>
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
                  <span className="text-3xl font-bold text-gray-900">1,284</span>
                  <span className="ml-2 text-sm text-green-600">+12%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Interview Completion
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">89%</span>
                  <span className="ml-2 text-sm text-green-600">+5%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Target className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Offer Acceptance</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">78%</span>
                  <span className="ml-2 text-sm text-red-600">-2%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Quality of Hire</span>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">4.8</span>
                  <span className="ml-2 text-sm text-green-600">+0.3</span>
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
