import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to reset and initialize user data
export const resetUserData = async (userId: string) => {
  try {
    // Start a transaction
    const { error: transactionError } = await supabase.rpc('begin_transaction');
    if (transactionError) throw transactionError;

    // Delete existing data
    await Promise.all([
      // Delete job applications
      supabase.from('job_applications').delete().eq('user_id', userId),
      // Delete jobs
      supabase.from('jobs').delete().eq('user_id', userId),
      // Delete job analytics
      supabase.from('job_analytics').delete().eq('job_id', userId),
      // Delete job board postings
      supabase.from('job_board_postings').delete().match({ user_id: userId }),
    ]);

    // Initialize with standard data
    const standardData = {
      jobs: [
        {
          user_id: userId,
          title: 'Software Engineer',
          department: 'Engineering',
          location: { city: 'San Francisco', state: 'CA', country: 'USA' },
          type: 'Full-time',
          seniority_level: 'Mid-Level',
          description: 'Standard software engineer position...',
          requirements: 'Bachelor\'s degree in Computer Science or related field...',
          salary_range: { min: 100000, max: 150000, currency: 'USD' },
          skills: ['JavaScript', 'React', 'Node.js'],
          benefits: ['Health Insurance', '401k', 'Remote Work'],
          status: 'published',
          views: 0,
          applications_count: 0
        }
      ],
      job_analytics: {
        views: 0,
        clicks: 0,
        applications: 0,
        interviews_scheduled: 0,
        interviews_completed: 0,
        offers_sent: 0,
        offers_accepted: 0,
        source_breakdown: {
          'LinkedIn': 0,
          'Indeed': 0,
          'Direct': 0
        }
      }
    };

    // Insert standard data
    const { error: jobError } = await supabase
      .from('jobs')
      .insert(standardData.jobs);
    if (jobError) throw jobError;

    // Commit transaction
    const { error: commitError } = await supabase.rpc('commit_transaction');
    if (commitError) throw commitError;

    return { success: true };
  } catch (error: any) {
    // Rollback transaction
    await supabase.rpc('rollback_transaction');
    console.error('Error resetting user data:', error);
    return { success: false, error: error.message };
  }
};

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
