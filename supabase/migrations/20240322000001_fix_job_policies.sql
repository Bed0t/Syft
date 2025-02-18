-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own jobs" ON jobs;

-- Create new policies
CREATE POLICY "Users can view their own jobs"
  ON jobs
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own jobs"
  ON jobs
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own jobs"
  ON jobs
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own jobs"
  ON jobs
  FOR DELETE
  USING (user_id = auth.uid()); 