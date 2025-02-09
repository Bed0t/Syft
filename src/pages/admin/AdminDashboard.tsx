<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Users,
  DollarSign,
  BarChart,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Home,
  User,
  Ticket,
  LineChart,
  Building,
} from 'lucide-react';
import Overview from './sections/Overview';
import UserManagement from './sections/UserManagement';
import SupportTickets from './sections/SupportTickets';
import Analytics from './sections/Analytics';
import Companies from './sections/Companies';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    activeUsers: 0,
    monthlyRevenue: 0,
    newSignups: 0,
    supportTickets: 0,
  });

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardStats();
  }, []);

  const checkAdminAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminData) {
      navigate('/admin/login');
    }
  };

  const fetchDashboardStats = async () => {
    // Fetch active users
    const { count: activeUsers } = await supabase.from('users').select('id', { count: 'exact' });

    // Fetch support tickets
    const { count: supportTickets } = await supabase
      .from('support_tickets')
      .select('id', { count: 'exact' })
      .eq('status', 'open');

    setStats({
      activeUsers: activeUsers || 0,
      monthlyRevenue: 25000, // Example static value
      newSignups: 150, // Example static value
      supportTickets: supportTickets || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Overview', icon: Home, path: '' },
    { name: 'Users', icon: User, path: 'users' },
    { name: 'Companies', icon: Building, path: 'companies' },
    { name: 'Support', icon: Ticket, path: 'support' },
    { name: 'Analytics', icon: LineChart, path: 'analytics' },
=======
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, Building, FileText, Settings, Activity, CreditCard } from 'lucide-react';

interface DashboardStats {
  totalCompanies: number;
  activeJobs: number;
  totalCandidates: number;
  totalInterviews: number;
  revenueThisMonth: number;
  interviewCompletionRate: number;
  averageTimeToHire: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    activeJobs: 0,
    totalCandidates: 0,
    totalInterviews: 0,
    revenueThisMonth: 0,
    interviewCompletionRate: 0,
    averageTimeToHire: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: companiesCount },
          { count: jobsCount },
          { count: candidatesCount },
          { count: interviewsCount }
        ] = await Promise.all([
          supabase.from('user_roles').select('id', { count: 'exact' }).eq('role', 'user'),
          supabase.from('jobs').select('id', { count: 'exact' }).eq('status', 'active'),
          supabase.from('candidates').select('id', { count: 'exact' }),
          supabase.from('interviews').select('id', { count: 'exact' })
        ]);

        setStats({
          totalCompanies: companiesCount || 0,
          activeJobs: jobsCount || 0,
          totalCandidates: candidatesCount || 0,
          totalInterviews: interviewsCount || 0,
          revenueThisMonth: 0, // This would come from your billing system
          interviewCompletionRate: 85, // Calculate this based on actual data
          averageTimeToHire: 12 // Calculate this based on actual data
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    { name: 'Companies', icon: Building, path: '/admin/companies', count: stats.totalCompanies },
    { name: 'Jobs', icon: FileText, path: '/admin/jobs', count: stats.activeJobs },
    { name: 'Candidates', icon: Users, path: '/admin/candidates', count: stats.totalCandidates },
    { name: 'Analytics', icon: Activity, path: '/admin/analytics' },
    { name: 'Billing', icon: CreditCard, path: '/admin/billing' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' }
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
  ];

  return (
    <div className="min-h-screen bg-gray-100">
<<<<<<< HEAD
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
            <h1 className="text-xl font-bold text-indigo-600">Admin Portal</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive =
                location.pathname === `/admin/dashboard/${item.path}` ||
                (item.path === '' && location.pathname === '/admin/dashboard');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Overview stats={stats} />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/support" element={<SupportTickets />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Total Companies</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{stats.totalCompanies}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Active Jobs</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{stats.activeJobs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Total Candidates</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{stats.totalCandidates}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Total Interviews</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{stats.totalInterviews}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Interview Completion Rate</p>
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-2xl font-semibold text-gray-900">{stats.interviewCompletionRate}%</span>
                  <span className="ml-2 text-sm text-green-600">↑ 5%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.interviewCompletionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Average Time to Hire</p>
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-2xl font-semibold text-gray-900">{stats.averageTimeToHire} days</span>
                  <span className="ml-2 text-sm text-green-600">↓ 2 days</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Revenue This Month</p>
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-2xl font-semibold text-gray-900">
                    ${stats.revenueThisMonth.toLocaleString()}
                  </span>
                  <span className="ml-2 text-sm text-green-600">↑ 12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  {item.count !== undefined && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.count} total
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default AdminDashboard;
=======
export default AdminDashboard;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
