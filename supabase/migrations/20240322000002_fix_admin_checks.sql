-- Ensure admin_users table exists and has correct structure
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can manage admin users" ON public.admin_users;

-- Create new policies
CREATE POLICY "Anyone can read admin users"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only super admins can manage admin users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id = auth.uid()
            AND admin_users.role = 'super_admin'
        )
    );

-- Insert test admin user if not exists
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'test@syft.com'
ON CONFLICT (id) DO NOTHING; 