import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// #region agent log
fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:4',message:'Env vars read from import.meta.env',data:{urlExists:!!supabaseUrl,urlLength:supabaseUrl?.length||0,urlValue:supabaseUrl?.substring(0,50)||'undefined',keyExists:!!supabaseAnonKey,keyLength:supabaseAnonKey?.length||0,keyPrefix:supabaseAnonKey?.substring(0,20)||'undefined',allEnvKeys:Object.keys(import.meta.env).filter(k=>k.startsWith('VITE_'))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
// #endregion

// Validate and create Supabase client
let supabase: ReturnType<typeof createClient>;

// Check if environment variables are properly set
const urlCheck1 = !!supabaseUrl;
const urlCheck2 = supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL_HERE';
const urlCheck3 = !supabaseUrl.includes('placeholder');
const urlCheck4 = supabaseUrl.startsWith('http');
const keyCheck1 = !!supabaseAnonKey;
const keyCheck2 = supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE';
const keyCheck3 = !supabaseAnonKey.includes('placeholder');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:18',message:'Validation checks',data:{urlCheck1,urlCheck2,urlCheck3,urlCheck4,keyCheck1,keyCheck2,keyCheck3},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
// #endregion

const isConfigured = urlCheck1 && 
                     keyCheck1 && 
                     urlCheck2 && 
                     urlCheck3 &&
                     keyCheck2 &&
                     keyCheck3 &&
                     urlCheck4;

if (!isConfigured) {
  const missingVars: string[] = [];
  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE' || supabaseUrl.includes('placeholder')) {
    missingVars.push('VITE_SUPABASE_URL');
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE' || supabaseAnonKey.includes('placeholder')) {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:35',message:'Configuration failed',data:{isConfigured,missingVars,urlValue:supabaseUrl||'undefined',keyPrefix:supabaseAnonKey?.substring(0,30)||'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
  // #endregion
  
  console.error(
    '❌ Supabase environment variables are not set correctly.\n' +
    `Missing or invalid: ${missingVars.join(', ')}\n` +
    'Please create a .env file in the project root with:\n' +
    'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your_anon_key\n\n' +
    'You can find these values in your Supabase project settings under API.'
  );
  // Create a client that will throw meaningful errors
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  );
} else {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:50',message:'Configuration successful',data:{urlPrefix:supabaseUrl.substring(0,30),keyPrefix:supabaseAnonKey.substring(0,30)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };


