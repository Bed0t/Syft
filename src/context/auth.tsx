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
    id: string;
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
  remainingAttempts?: number;
  lockoutEndsAt?: Date;
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
  const [remainingAttempts, setRemainingAttempts] = useState<number>();
  const [lockoutEndsAt, setLockoutEndsAt] = useState<Date>();

  const handleError = (err: unknown, message: string): AuthContextError => {
    console.error(`${message}:`, err);
    
    // Check for rate limit errors
    if (err instanceof AuthError) {
      if (err.message.includes('Too many requests')) {
        const match = err.message.match(/Try again in (\d+) minutes/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          setLockoutEndsAt(new Date(Date.now() + minutes * 60 * 1000));
          setRemainingAttempts(0);
        }
      } else if (err.message.includes('Invalid login credentials')) {
        // Extract remaining attempts from error message if available
        const match = err.message.match(/(\d+) attempts? remaining/);
        if (match) {
          setRemainingAttempts(parseInt(match[1], 10));
        } else {
          // If no attempts info in message, decrement current count
          setRemainingAttempts(prev => Math.max((prev ?? 5) - 1, 0));
        }
      }
    }
    
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
      // Only log user ID, not any sensitive info
      console.log('Checking admin status for user ID:', userId);
      
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });
      
      if (error) {
        throw handleError(error, 'Error checking admin status');
      }
      
      // Don't log the actual result for security
      console.log('Admin status check completed');
      return !!data;
    } catch (err) {
      handleError(err, 'Failed to check admin status');
      return false;
    }
  };

  const createAdminSession = async (userId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .rpc('create_admin_session', { user_id: userId });
      
      if (error) throw error;
      return data;
    } catch (err) {
      handleError(err, 'Failed to create admin session');
      return null;
    }
  };

  const verifyAdminSession = async (sessionId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('verify_admin_session', { session_id: sessionId });
      
      if (error) throw error;
      return !!data;
    } catch (err) {
      handleError(err, 'Failed to verify admin session');
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

      let currentAdminStatus = await checkAdminStatus(session.user.id);
      
      // If admin, create/verify session
      let adminSession: EnhancedUser['adminSession'];
      if (currentAdminStatus) {
        const currentUser = user || session.user as EnhancedUser;
        if (!currentUser.adminSession?.id) {
          const sessionId = await createAdminSession(session.user.id);
          if (sessionId) {
            adminSession = {
              id: sessionId,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              lastActive: new Date().toISOString()
            };
          } else {
            currentAdminStatus = false;
          }
        } else {
          const isValid = await verifyAdminSession(currentUser.adminSession.id);
          if (!isValid) {
            currentAdminStatus = false;
          } else {
            adminSession = currentUser.adminSession;
          }
        }
      }

      setUser({
        ...session.user,
        adminSession
      });
      setIsAdmin(currentAdminStatus);
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
      console.log('Auth state change:', event);
      
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      error, 
      isInitialized,
      remainingAttempts,
      lockoutEndsAt
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 