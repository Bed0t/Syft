import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth';

interface LocationState {
  returnUrl?: string;
  error?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, isAdmin, isInitialized, remainingAttempts, lockoutEndsAt } = useAuth();

  // Handle navigation when user is authenticated
  useEffect(() => {
    if (!authLoading && isInitialized && user) {
      console.log('User authenticated, navigating...');
      
      // Get return URL from location state or use default
      const state = location.state as LocationState;
      const returnUrl = state?.returnUrl || (isAdmin ? '/admin/dashboard' : '/dashboard');
      
      // Navigate with replace to prevent back button from returning to login
      navigate(returnUrl, { replace: true });
    }
  }, [user, authLoading, isAdmin, isInitialized, navigate, location]);

  // Handle initial error from navigation state
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.error) {
      setError(state.error);
      // Clear the error from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    // Check if user is locked out
    if (lockoutEndsAt && lockoutEndsAt > new Date()) {
      const minutes = Math.ceil((lockoutEndsAt.getTime() - Date.now()) / (1000 * 60));
      setError(`Too many login attempts. Please try again in ${minutes} minutes.`);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      console.log('Starting login process...');
      
      // Validate email
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Sign in error type:', signInError.name);
        throw signInError;
      }

      // Don't navigate here - the useEffect will handle it
      console.log('Login successful - waiting for auth state update');
    } catch (err) {
      console.error('Login error type:', err instanceof Error ? err.name : typeof err);
      
      let errorMessage: string;
      if (err instanceof AuthError) {
        switch (err.message) {
          case 'Invalid login credentials':
            errorMessage = remainingAttempts 
              ? `Invalid email or password. ${remainingAttempts} attempts remaining.`
              : 'Invalid email or password.';
            break;
          case 'Email not confirmed':
            errorMessage = 'Please verify your email address.';
            break;
          case 'Rate limit exceeded':
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          default:
            errorMessage = err.message;
        }
      } else {
        errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      // Show success message
      setError('Password reset instructions sent to your email');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Brain className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
            contact us to get started
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className={`mb-4 rounded-md p-2 text-sm ${
              error.includes('sent to your email') 
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {error}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  disabled={loading || (lockoutEndsAt && lockoutEndsAt > new Date())}
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
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  disabled={loading || (lockoutEndsAt && lockoutEndsAt > new Date())}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  disabled={loading || (lockoutEndsAt && lockoutEndsAt > new Date())}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || !email || (lockoutEndsAt && lockoutEndsAt > new Date())}
                  className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || authLoading || (lockoutEndsAt && lockoutEndsAt > new Date())}
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

export default Login;
