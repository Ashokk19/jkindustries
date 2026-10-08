import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client using browser-safe anon key only.
 *
 * SECURITY:
 *   - Uses VITE_SUPABASE_ANON_KEY (publishable, safe for browser)
 *   - NEVER uses service_role key or DATABASE_PASSWORD in browser code
 *   - All data access is governed by Row Level Security (RLS) policies
 *   - Public users can only SELECT active products
 *   - Admin write operations require authenticated session
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing or placeholder VITE_SUPABASE_ANON_KEY. ' +
    'Database updates require a valid Supabase anon key in .env.\n' +
    'Project URL: ' + (supabaseUrl || 'not set') + '\n' +
    'Ensure VITE_SUPABASE_ANON_KEY is provided in .env to connect to your remote database.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);
