/*
  # User Profile Enhancement

  1. Changes
    - Add role and avatar_url columns to users table
    - Update user profile creation trigger
    - Add policy for profile updates
    
  2. Security
    - Maintain existing RLS policies
    - Add policy for users to update their own profiles
*/

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'Recruiting Manager',
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user creation
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    avatar_url,
    company_name,
    subscription_tier,
    subscription_status
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    'Recruiting Manager',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    'free',
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    company_name = COALESCE(EXCLUDED.company_name, users.company_name),
    updated_at = now();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create policy for profile updates
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);