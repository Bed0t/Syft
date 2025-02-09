import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import {
  Brain,
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart,
  CreditCard,
  Settings as SettingsIcon,
} from 'lucide-react';
=======
import { Brain, LayoutDashboard, Briefcase, Users, BarChart, CreditCard, Settings as SettingsIcon } from 'lucide-react';
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
import Overview from './dashboard/Overview';
import Jobs from './dashboard/Jobs';
import Candidates from './dashboard/Candidates';
import Analytics from './dashboard/Analytics';
import Billing from './dashboard/Billing';
import Settings from './dashboard/Settings';
import CreateJob from './dashboard/CreateJob';
<<<<<<< HEAD

const Dashboard = () => {
  const location = useLocation();

=======
import JobDetails from './dashboard/JobDetails'; // Add this import

const Dashboard = () => {
  const location = useLocation();
  
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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
<<<<<<< HEAD
        <div className="flex w-64 flex-col">
          <div className="flex h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <Brain className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Syft</span>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive =
                    location.pathname === `/dashboard/${item.path}` ||
=======
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Brain className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Syft</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === `/dashboard/${item.path}` ||
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                    (item.path === '' && location.pathname === '/dashboard');
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
<<<<<<< HEAD
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
=======
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
<<<<<<< HEAD
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
=======
                      <item.icon className={`mr-3 h-6 w-6 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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
<<<<<<< HEAD
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
=======
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/create" element={<CreateJob />} />
<<<<<<< HEAD
=======
            <Route path="/jobs/:id" element={<JobDetails />} /> {/* Add this route */}
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
