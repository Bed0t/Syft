import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Enhanced error types
export class AuthContextError extends Error {
  constructor(message: string, public code?: string, public originalError?: unknown) {
    super(message);
    this.name = 'AuthContextError';
  }
}

// Enhanced user type with admin info
interface EnhancedUser extends User {
  adminSession?: {
    expiresAt: string;
    lastActive?: string;
  };
}

// Enhanced context type
interface AuthContextType {
  user: EnhancedUser | null;
  loading: boolean;
  isAdmin: boolean;
  error: AuthContextError | AuthError | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  isAdmin: false,
  error: null,
  isInitialized: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<AuthContextError | AuthError | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleError = (err: unknown, message: string): AuthContextError => {
    console.error(`${message}:`, err);
    const authError = new AuthContextError(
      message,
      err instanceof AuthError ? String(err.status) : undefined,
      err
    );
    setError(authError);
    return authError;
  };

  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
      
      if (error) {
        throw handleError(error, 'Error checking admin status');
      }
      
      console.log('Admin status result:', data);
      return !!data;
    } catch (err) {
      handleError(err, 'Failed to check admin status');
      return false;
    }
  };

  const updateUserState = async (session: Session | null) => {
    try {
      if (!session?.user) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const adminStatus = await checkAdminStatus(session.user.id);
      
      // If admin, get admin session info
      let adminSession;
      if (adminStatus) {
        const { data: sessionInfo, error: sessionError } = await supabase
          .rpc('get_admin_session_info', { user_id: session.user.id });
          
        if (sessionError) {
          console.warn('Error fetching admin session:', sessionError);
        } else if (sessionInfo) {
          adminSession = {
            expiresAt: sessionInfo.expires_at,
            lastActive: sessionInfo.last_active
          };
        }
      }

      setUser({
        ...session.user,
        adminSession
      });
      setIsAdmin(adminStatus);
    } catch (err) {
      handleError(err, 'Failed to update user state');
    }
  };

  useEffect(() => {
    console.log('Initializing auth state...');
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw handleError(error, 'Session error');
        }

        if (mounted) {
          await updateUserState(session);
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          handleError(err, 'Failed to initialize auth');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session);
      
      if (!mounted) return;
      
      setLoading(true);
      try {
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            await updateUserState(session);
            break;
          case 'SIGNED_OUT':
            setUser(null);
            setIsAdmin(false);
            setError(null);
            break;
          default:
            if (session?.user) {
              await updateUserState(session);
            }
        }
      } catch (err) {
        handleError(err, 'Error handling auth state change');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, error, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 