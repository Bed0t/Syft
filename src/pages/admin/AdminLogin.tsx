import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { createAdminSession } from '../../lib/admin/auth';
import { useAuth } from '../../context/auth';

interface LocationState {
  from?: Location;
  error?: string;
  returnUrl?: string;
}

interface FormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Redirect based on user type
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Starting admin login process...');
      
      // Sign out any existing session first
      await supabase.auth.signOut();
      console.log('Signed out existing session');

      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }
      
      if (!authUser) {
        console.error('No user returned after login');
        throw new Error('No user returned after login');
      }

      console.log('User authenticated successfully:', authUser.id);

      // Verify admin status
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      console.log('Admin check result:', { adminData, adminError });

      if (adminError) {
        console.error('Admin verification error:', adminError);
        throw new Error(`Admin verification failed: ${adminError.message}`);
      }

      if (!adminData) {
        console.error('User is not an admin');
        throw new Error('Unauthorized access - Admin privileges required');
      }

      // Create admin session
      console.log('Creating admin session...');
      const session = await createAdminSession(authUser.id);
      console.log('Admin session created:', session);

      // Force refresh the auth context
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session refresh error:', sessionError);
      }
      console.log('Session refreshed:', currentSession);

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof AuthError 
        ? err.message 
        : err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      
      // If there was an error, sign out to clean up the auth state
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {(error || state?.error) && (
            <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">
              {error || state.error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
