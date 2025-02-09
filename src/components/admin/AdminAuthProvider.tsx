import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminAuthContext, checkAdminStatus, verifyAdminSession, invalidateAdminSession } from '../../lib/admin/auth';
import { supabase } from '../../lib/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string | undefined;
  role: 'admin' | 'super_admin';
  lastActive?: string;
}

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | AuthError | null>(null);

  const handleAuthError = useCallback((err: Error | AuthError, redirectToLogin = true) => {
    console.error('Auth error:', err);
    setError(err);
    setAdminUser(null);
    
    if (redirectToLogin) {
      const returnUrl = location.pathname;
      navigate('/admin/login', { 
        state: { 
          returnUrl, 
          error: err.message 
        },
        replace: true 
      });
    }
  }, [navigate, location]);

  const checkAuth = useCallback(async (session: Session | null) => {
    try {
      if (!session?.user?.id) {
        throw new Error('No valid session found');
      }

      const [isAdmin, hasValidSession] = await Promise.all([
        checkAdminStatus(session.user.id),
        verifyAdminSession(session.user.id)
      ]);

      if (!isAdmin || !hasValidSession) {
        throw new Error('Unauthorized access');
      }

      setAdminUser({
        id: session.user.id,
        email: session.user.email,
        role: 'admin', // You might want to fetch this from your admin_users table
        lastActive: new Date().toISOString(),
      });
      setError(null);
    } catch (err) {
      handleAuthError(err instanceof Error ? err : new Error('Authentication failed'));
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        await checkAuth(session);
      } catch (err) {
        handleAuthError(err instanceof Error ? err : new Error('Failed to initialize auth'), false);
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        setError(null);
        navigate('/admin/login', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        await checkAuth(session);
      }
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, checkAuth, handleAuthError]);

  const signOut = async () => {
    try {
      setLoading(true);
      if (adminUser?.id) {
        await invalidateAdminSession(adminUser.id);
      }
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      setAdminUser(null);
      setError(null);
      navigate('/admin/login', { replace: true });
    } catch (err) {
      handleAuthError(err instanceof Error ? err : new Error('Failed to sign out'), false);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    adminUser,
    loading,
    error,
    signOut,
    isAuthenticated: !!adminUser,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};