interface EnvConfig {
  SYNTHFLOW_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

const requiredEnvVars = [
  'SYNTHFLOW_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
] as const;

const validateEnv = (): EnvConfig => {
  for (const key of requiredEnvVars) {
    if (!import.meta.env[`VITE_${key}`]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    SYNTHFLOW_API_KEY: import.meta.env.VITE_SYNTHFLOW_API_KEY,
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NODE_ENV: import.meta.env.MODE as EnvConfig['NODE_ENV'],
  };
};

export const env = validateEnv();