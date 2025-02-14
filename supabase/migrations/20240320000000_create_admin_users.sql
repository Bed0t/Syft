-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.admin_users(id) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.admin_users
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable all access for admin users" ON public.admin_users
    FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Enable all access for admin users" ON public.admin_sessions
    FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Insert admin user (make sure this ID matches your admin user's auth.users ID)
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@syft.com'
ON CONFLICT (id) DO NOTHING; 