<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to delete a user and their data
export const deleteUser = async (email: string) => {
  try {
    // First get the user ID from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) throw userError;
    if (!userData?.id) throw new Error('User not found');

    // Delete user's data from related tables
    await Promise.all([
      // Delete from users table
      supabase.from('users').delete().eq('id', userData.id),
      // Delete from auth.users (this will cascade delete other auth relations)
      supabase.auth.admin.deleteUser(userData.id),
    ]);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};
=======
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

interface Database {
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          id: string;
          user_id: string;
          expires_at: string;
          created_at: string;
          last_active: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          expires_at: string;
          created_at?: string;
          last_active?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          expires_at?: string;
          created_at?: string;
          last_active?: string | null;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'super_admin' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'admin' | 'super_admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'super_admin' | 'user';
          created_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
  };
}

let supabase: SupabaseClient<Database>;

try {
  supabase = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      db: {
        schema: 'public',
      },
    }
  );
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw new Error('Failed to initialize Supabase client. Please check your configuration.');
}

export { supabase, type Database };
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
