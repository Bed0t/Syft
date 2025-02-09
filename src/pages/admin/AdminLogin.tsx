import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { supabase } from '../../lib/supabase';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
=======
import { Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { createAdminSession } from '../../lib/admin/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
<<<<<<< HEAD
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.signInWithPassword({
=======
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
        email,
        password,
      });

<<<<<<< HEAD
      if (authError) throw authError;

      // Verify if the user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user?.id)
        .single();

      if (adminError || !adminData) {
        throw new Error('Unauthorized access');
      }

      // Log admin activity
      await supabase.from('admin_activity_logs').insert({
        admin_id: user?.id,
        action: 'login',
        details: { ip: 'system' },
      });

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user?.id);

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
=======
      if (signInError) throw signInError;

      // Verify admin status
      const { data: userData, error: userError } = await supabase
        .rpc('is_admin', { user_id: user?.id });

      if (userError) throw userError;

      if (!userData) {
        throw new Error('Unauthorized access');
      }

      // Create admin session
      await createAdminSession(user?.id);

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
=======
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-indigo-600" />
        </div>
<<<<<<< HEAD
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Portal</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">{error}</div>
          )}

=======
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
=======
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
=======
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
<<<<<<< HEAD
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
=======
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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

<<<<<<< HEAD
export default AdminLogin;
=======
export default AdminLogin;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
