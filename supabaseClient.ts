import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a dummy client if env vars are missing (for development)
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE') {
  console.warn(
    '⚠️ Supabase environment variables are not set. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
  // Create a dummy client that will fail gracefully
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };


