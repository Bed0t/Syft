import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Users, Clock, Target, ArrowUp, ArrowDown, Brain, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewProps {
  stats: {
    activeUsers: number;
    monthlyRevenue: number;
    newSignups: number;
    supportTickets: number;
  };
}

const Overview: React.FC<OverviewProps> = ({ stats }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Photo */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 to-indigo-700">
          <div className="grid items-center gap-8 p-8 lg:grid-cols-2">
            <div className="text-white">
              <h1 className="mb-4 text-3xl font-bold">Welcome Back!</h1>
              <p className="mb-6 text-indigo-100">
                Your recruitment analytics are showing positive trends this week.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-sm text-indigo-100">Total Applications</div>
                  <div className="text-2xl font-bold">845</div>
                  <div className="flex items-center text-sm text-green-400">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +5.2%
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-sm text-indigo-100">Time to Hire</div>
                  <div className="text-2xl font-bold">18d</div>
                  <div className="flex items-center text-sm text-green-400">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    -12%
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Professional"
                className="h-[400px] w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Applications',
              value: '245',
              change: '+13%',
              period: 'vs last month',
              icon: Users,
              color: 'bg-blue-500',
            },
            {
              title: 'Session Duration',
              value: '2m 18s',
              change: '+8%',
              period: 'vs last month',
              icon: Clock,
              color: 'bg-green-500',
            },
            {
              title: 'Conversion Rate',
              value: '3.8%',
              change: '+2.1%',
              period: 'vs last month',
              icon: Target,
              color: 'bg-purple-500',
            },
            {
              title: 'Active Jobs',
              value: '12',
              change: '+4',
              period: 'this week',
              icon: Brain,
              color: 'bg-orange-500',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`${item.color} rounded-xl p-3`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {item.change}
                </div>
              </div>
              <div className="mb-1 text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-gray-500">{item.title}</div>
              <div className="mt-1 text-xs text-gray-400">{item.period}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Transactions Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h3 className="mb-6 text-lg font-semibold">Application Sources</h3>
            <div className="relative mx-auto mb-4 h-48 w-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">80%</div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
              </div>
              {/* Placeholder for actual chart implementation */}
              <div className="h-full w-full rounded-full border-8 border-indigo-100">
                <div className="h-full w-full -rotate-45 transform rounded-full border-8 border-indigo-500 border-t-transparent" />
              </div>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-indigo-500" />
                Direct
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                LinkedIn
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-orange-500" />
                Other
              </div>
            </div>
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h3 className="mb-6 text-lg font-semibold">Monthly Applications</h3>
            <div className="flex h-[200px] items-end justify-between gap-2">
              {[40, 70, 30, 80, 50, 90].map((height, index) => (
                <div key={index} className="w-full">
                  <div
                    className="rounded-t-lg bg-indigo-500 transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
