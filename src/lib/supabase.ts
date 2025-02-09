import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
