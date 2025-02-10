import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Brain,
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart,
  CreditCard,
  Settings as SettingsIcon,
} from 'lucide-react';
import Overview from './dashboard/Overview';
import Jobs from './dashboard/Jobs';
import Candidates from './dashboard/Candidates';
import Analytics from './dashboard/Analytics';
import Billing from './dashboard/Billing';
import Settings from './dashboard/Settings';
import CreateJob from './dashboard/CreateJob';
import JobDetails from './dashboard/JobDetails';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setLoading(false);
      } catch (e) {
        console.error('Dashboard error:', e);
        setError(e as Error);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-600">Error: {error.message}</div>;
  }

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, path: '' },
    { name: 'Jobs', icon: Briefcase, path: 'jobs' },
    { name: 'Candidates', icon: Users, path: 'candidates' },
    { name: 'Analytics', icon: BarChart, path: 'analytics' },
    { name: 'Billing', icon: CreditCard, path: 'billing' },
    { name: 'Settings', icon: SettingsIcon, path: 'settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <Brain className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Syft</span>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === `/dashboard/${item.path}` ||
                    (item.path === '' && location.pathname === '/dashboard');
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`mr-3 h-6 w-6 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Suspense fallback={<div>Loading page...</div>}>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/create" element={<CreateJob />} />
              <Route path="jobs/:id" element={<JobDetails />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
