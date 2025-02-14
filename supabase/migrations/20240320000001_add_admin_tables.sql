-- Create admin_users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users') THEN
        CREATE TABLE public.admin_users (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            email TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- Create admin_sessions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_sessions') THEN
        CREATE TABLE public.admin_sessions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES public.admin_users(id) NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
    EXECUTE 'ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY';
EXCEPTION 
    WHEN others THEN NULL;
END $$;

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.admin_users;
    DROP POLICY IF EXISTS "Enable all access for admin users" ON public.admin_users;
    DROP POLICY IF EXISTS "Enable all access for admin users" ON public.admin_sessions;
    
    -- Create new policies
    CREATE POLICY "Enable read access for authenticated users" ON public.admin_users
        FOR SELECT TO authenticated
        USING (true);

    CREATE POLICY "Enable all access for admin users" ON public.admin_users
        FOR ALL TO authenticated
        USING (auth.uid() IN (SELECT id FROM public.admin_users));

    CREATE POLICY "Enable all access for admin users" ON public.admin_sessions
        FOR ALL TO authenticated
        USING (auth.uid() IN (SELECT id FROM public.admin_users));
EXCEPTION 
    WHEN others THEN NULL;
END $$;

-- Insert admin user if not exists
DO $$ 
BEGIN
    INSERT INTO public.admin_users (id, email, role)
    SELECT id, email, 'admin'
    FROM auth.users
    WHERE email = 'admin@syft.com'
    ON CONFLICT (id) DO NOTHING;
END $$; 