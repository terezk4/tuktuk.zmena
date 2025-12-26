import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate and create Supabase client
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE' || supabaseUrl.includes('placeholder')) {
  console.error(
    '❌ Supabase environment variables are not set correctly.\n' +
    'Please create a .env file in the project root with:\n' +
    'VITE_SUPABASE_URL=your_project_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_anon_key'
  );
  // Create a client that will throw meaningful errors
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  );
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };


