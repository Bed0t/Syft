import { createContext, useContext } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface AdminUser {
  id: string;
  email: string | undefined;
  role: 'admin' | 'super_admin';
  lastActive?: string;
}

export interface AdminSession {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  lastActive?: string;
}

export interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  error: Error | AuthError | null;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export class AdminAuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  loading: true,
  error: null,
  signOut: async () => {},
  isAuthenticated: false,
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });

    if (error) {
      throw new AdminAuthError('Failed to verify admin status', error.code);
    }

    return !!data;
  } catch (error) {
    if (error instanceof AdminAuthError) throw error;
    throw new AdminAuthError('Failed to verify admin status');
  }
};

export const verifyAdminSession = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') return false; // No session found
      throw new AdminAuthError('Failed to verify admin session', error.code);
    }

    // Update last active timestamp
    await supabase
      .from('admin_sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('id', data.id)
      .throwOnError();

    return true;
  } catch (error) {
    if (error instanceof AdminAuthError) throw error;
    throw new AdminAuthError('Failed to verify admin session');
  }
};

export const createAdminSession = async (userId: string): Promise<AdminSession> => {
  try {
    // Delete any existing sessions for this user
    await invalidateAdminSession(userId);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { data, error } = await supabase
      .from('admin_sessions')
      .insert({
        user_id: userId,
        expires_at: expiresAt.toISOString(),
        last_active: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new AdminAuthError('Failed to create admin session', error.code);
    }

    if (!data) {
      throw new AdminAuthError('Failed to create admin session - no data returned');
    }

    return {
      id: data.id,
      userId: data.user_id,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
      lastActive: data.last_active,
    };
  } catch (error) {
    if (error instanceof AdminAuthError) throw error;
    throw new AdminAuthError('Failed to create admin session');
  }
};

export const invalidateAdminSession = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('user_id', userId)
      .throwOnError();

    if (error) {
      throw new AdminAuthError('Failed to invalidate admin session', error.code);
    }
  } catch (error) {
    if (error instanceof AdminAuthError) throw error;
    throw new AdminAuthError('Failed to invalidate admin session');
  }
};

export const getAdminSessionInfo = async (userId: string): Promise<AdminSession | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('id, user_id, expires_at, created_at, last_active')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No session found
      throw new AdminAuthError('Failed to get admin session info', error.code);
    }

    return data ? {
      id: data.id,
      userId: data.user_id,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
      lastActive: data.last_active,
    } : null;
  } catch (error) {
    if (error instanceof AdminAuthError) throw error;
    throw new AdminAuthError('Failed to get admin session info');
  }
};