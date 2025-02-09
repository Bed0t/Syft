import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminAuthContext, checkAdminStatus, verifyAdminSession, invalidateAdminSession } from '../../lib/admin/auth';
import { supabase } from '../../lib/supabase';
import { AuthError } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string | undefined;
  role: 'admin' | 'user';
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

  const handleAuthError = useCallback((err: Error | AuthError) => {
    setError(err);
    setAdminUser(null);
    const returnUrl = location.pathname;
    navigate('/admin/login', { state: { returnUrl, error: err.message } });
  }, [navigate, location]);

  const checkAuth = useCallback(async (session: any) => {
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
        role: 'admin',
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
        if (session) await checkAuth(session);
        else setLoading(false);
      } catch (err) {
        handleAuthError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        setError(null);
        navigate('/admin/login');
      } else if (event === 'SIGNED_IN' && session) {
        await checkAuth(session);
      }
    });

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
      navigate('/admin/login');
    } catch (err) {
      handleAuthError(err instanceof Error ? err : new Error('Failed to sign out'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser, 
      loading, 
      error, 
      signOut,
      isAuthenticated: !!adminUser 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};