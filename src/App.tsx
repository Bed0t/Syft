import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import SignupFlow from './components/SignupFlow';
import { AuthProvider, useAuth } from './context/auth';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

// Protected Admin Route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const [sessionValid, setSessionValid] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const checkAdminSession = async () => {
      if (!user || !isAdmin) {
        setSessionValid(false);
        setSessionLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_sessions')
          .select('id')
          .eq('user_id', user.id)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (error || !data) {
          // If session is invalid, sign out
          await supabase.auth.signOut();
          setSessionValid(false);
        } else {
          setSessionValid(true);
        }
      } catch {
        setSessionValid(false);
      } finally {
        setSessionLoading(false);
      }
    };

    checkAdminSession();
  }, [user, isAdmin]);

  if (loading || sessionLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect non-admin users to regular dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!sessionValid) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Layout component to reduce repetition
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <div className="pt-16">
      {children}
    </div>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupFlow />} />

            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/thank-you" element={<Layout><ThankYou /></Layout>} />
            
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
