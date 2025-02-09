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

interface DashboardStats {
  activeUsers: number;
  monthlyRevenue: number;
  newSignups: number;
  supportTickets: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 0,
    monthlyRevenue: 0,
    newSignups: 0,
    supportTickets: 0,
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await checkAdminAuth();
        await fetchDashboardStats();
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        navigate('/admin/login');
      }
    };

    initializeDashboard();
  }, [navigate]);

  const checkAdminAuth = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData) {
      throw new Error('Unauthorized access');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [usersCount, ticketsCount] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase
          .from('support_tickets')
          .select('id', { count: 'exact' })
          .eq('status', 'open'),
      ]);

      setStats({
        activeUsers: usersCount.count || 0,
        monthlyRevenue: 25000, // Example static value
        newSignups: 150, // Example static value
        supportTickets: ticketsCount.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Overview', icon: Home, path: '' },
    { name: 'Users', icon: User, path: 'users' },
    { name: 'Companies', icon: Building, path: 'companies' },
    { name: 'Support', icon: Ticket, path: 'support' },
    { name: 'Analytics', icon: LineChart, path: 'analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
