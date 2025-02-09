<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Users, Clock, Target, ArrowUp, ArrowDown, Brain, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Overview = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    monthlyRevenue: 0,
    newSignups: 0,
    supportTickets: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get total applications
      const { count: applications } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      setStats({
        activeUsers: applications || 0,
        monthlyRevenue: 25000,
        newSignups: 150,
        supportTickets: 12,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
=======
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Phone, UserCheck, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { name: 'Active Jobs', value: '12', icon: Briefcase, color: 'bg-blue-500' },
  { name: 'Total Candidates', value: '248', icon: Users, color: 'bg-green-500' },
  { name: 'Scheduled Interviews', value: '18', icon: Phone, color: 'bg-yellow-500' },
  { name: 'Hired Candidates', value: '32', icon: UserCheck, color: 'bg-purple-500' },
];

const recentActivity = [
  {
    candidate: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    status: 'Applied',
    time: '2 hours ago',
  },
  {
    candidate: 'Michael Chen',
    position: 'Product Manager',
    status: 'Interview Scheduled',
    time: '4 hours ago',
  },
  {
    candidate: 'Emma Davis',
    position: 'UX Designer',
    status: 'Hired',
    time: '1 day ago',
  },
  {
    candidate: 'James Wilson',
    position: 'Backend Developer',
    status: 'Assessment Completed',
    time: '1 day ago',
  },
  {
    candidate: 'Lisa Anderson',
    position: 'Marketing Manager',
    status: 'Second Interview',
    time: '2 days ago',
  },
];

const Overview = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            </motion.div>
          ))}
        </div>

<<<<<<< HEAD
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
=======
        {/* Application Trends Chart */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Application Trends</h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-500">12% increase</span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              [Application Trends Chart Placeholder]
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {activity.candidate.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{activity.candidate}</h3>
                        <p className="text-sm text-gray-500">{activity.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {activity.status}
                      </span>
                      <div className="ml-4 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Overview;
=======
export default Overview;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
