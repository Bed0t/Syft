-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.admin_users;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.admin_users;

-- Create new non-recursive policies
CREATE POLICY "Users can read admin users"
  ON public.admin_users
  FOR SELECT
  USING (true);

CREATE POLICY "Admin users can manage admin users"
  ON public.admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  ); 