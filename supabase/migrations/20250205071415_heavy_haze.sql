/*
  # Update admin user role

  1. Changes
    - Updates the role of admin@syft.com to super_admin
  
  2. Security
    - Only affects a single user
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN 
  UPDATE auth.users 
  SET role = 'super_admin'::user_role 
  WHERE email = 'admin@syft.com';
END $$;