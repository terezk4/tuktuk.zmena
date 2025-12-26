import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { User } from '../types';
import { ADMIN_EMAILS } from '../constants';
import { supabase } from '../supabaseClient';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Check Supabase configuration on mount
  useEffect(() => {
    const checkSupabaseConfig = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthPage.tsx:22',message:'AuthPage env check start',data:{urlExists:!!supabaseUrl,urlType:typeof supabaseUrl,urlValue:supabaseUrl?.substring(0,50)||String(supabaseUrl),keyExists:!!supabaseAnonKey,keyType:typeof supabaseAnonKey,keyPrefix:supabaseAnonKey?.substring(0,30)||String(supabaseAnonKey)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Debug: log what we're getting (only first few chars of key for security)
      console.log('🔍 Supabase Config Check:', {
        url: supabaseUrl ? '✓ Set' : '✗ Missing',
        key: supabaseAnonKey ? `✓ Set (${supabaseAnonKey.substring(0, 20)}...)` : '✗ Missing'
      });
      
      const check1 = !supabaseUrl;
      const check2 = !supabaseAnonKey;
      const check3 = supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';
      const check4 = supabaseUrl.includes('placeholder');
      const check5 = supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE';
      const check6 = supabaseAnonKey.includes('placeholder');
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthPage.tsx:35',message:'AuthPage validation checks',data:{check1,check2,check3,check4,check5,check6,willFail:check1||check2||check3||check4||check5||check6},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      if (check1 || check2 || check3 || check4 || check5 || check6) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/353d7741-f0a0-43ea-811d-fb047ab5994f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthPage.tsx:38',message:'Config error set',data:{reason:'validation failed'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        setConfigError('Supabase není správně nakonfigurován. Zkontroluj .env soubor a ujisti se, že obsahuje VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY.');
        return;
      }
      
      // Validate URL format
      try {
        new URL(supabaseUrl);
      } catch {
        setConfigError('Neplatný formát Supabase URL. Zkontroluj .env soubor.');
        return;
      }
      
      // Test connection by trying to get the current session (lightweight check)
      try {
        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError && sessionError.message.includes('Failed to fetch')) {
          setConfigError('Nelze se připojit k Supabase serveru. Zkontroluj, že URL a klíč jsou správné a server je dostupný.');
        }
      } catch (err: any) {
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          setConfigError('Nelze se připojit k Supabase serveru. Zkontroluj internetové připojení a konfiguraci.');
        }
      }
    };
    
    checkSupabaseConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || 
          supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE' || 
          supabaseUrl.includes('placeholder') ||
          supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE' ||
          supabaseAnonKey.includes('placeholder')) {
        setError('Supabase není správně nakonfigurován. Zkontroluj .env soubor a ujisti se, že obsahuje VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY.');
        setLoading(false);
        return;
      }
      
      // Validate URL format
      try {
        new URL(supabaseUrl);
      } catch {
        setError('Neplatný formát Supabase URL. Zkontroluj .env soubor.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          // Handle specific error messages
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Neplatné přihlašovací údaje. Zkontroluj email a heslo.');
          } else if (signInError.message.includes('Failed to fetch')) {
            setError('Nelze se připojit k serveru. Zkontroluj internetové připojení a Supabase konfiguraci.');
          } else {
            setError(signInError.message || 'Nepodařilo se přihlásit.');
          }
          setLoading(false);
          return;
        }
        
        if (!data.user) {
          setError('Nepodařilo se přihlásit. Zkus to prosím znovu.');
          setLoading(false);
          return;
        }

        const isAdmin = ADMIN_EMAILS.includes(data.user.email ?? '');
        const loggedInUser: User = {
          id: data.user.id,
          email: data.user.email ?? '',
          role: isAdmin ? 'admin' : 'user',
        };
        onLogin(loggedInUser);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          // Handle specific error messages
          if (signUpError.message.includes('User already registered')) {
            setError('Uživatel s tímto emailem již existuje. Přihlas se prosím.');
          } else if (signUpError.message.includes('Failed to fetch')) {
            setError('Nelze se připojit k serveru. Zkontroluj internetové připojení a Supabase konfiguraci.');
          } else if (signUpError.message.includes('Password')) {
            setError('Heslo musí mít alespoň 6 znaků.');
          } else {
            setError(signUpError.message || 'Registrace selhala.');
          }
          setLoading(false);
          return;
        }
        
        if (!data.user) {
          setError('Registrace selhala. Zkus to prosím znovu.');
          setLoading(false);
          return;
        }

        const isAdmin = ADMIN_EMAILS.includes(data.user.email ?? '');
        const registeredUser: User = {
          id: data.user.id,
          email: data.user.email ?? '',
          role: isAdmin ? 'admin' : 'user',
        };
        onLogin(registeredUser);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message?.includes('Failed to fetch')) {
        setError('Nelze se připojit k serveru. Zkontroluj, že máš správně nastavený .env soubor s VITE_SUPABASE_URL.');
      } else {
        setError(err.message || 'Nastala chyba. Zkus to prosím znovu.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-pink p-4">
      <div className="bg-white border-3 border-brand-black p-8 shadow-hard max-w-md w-full relative">
        
        {/* Decorative Header Badge */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-brand-lime px-6 py-2 border-3 border-brand-black shadow-sm">
           <span className="font-black text-xl uppercase tracking-widest">
             {isLogin ? 'Vítej Zpět' : 'Přidej se'}
           </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
          
          <div className="flex flex-col gap-2">
            <label className="font-black uppercase text-sm">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-3 border-brand-black p-3 font-bold focus:outline-none focus:bg-brand-lime/20"
              placeholder="tvuj@email.cz"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-black uppercase text-sm">Heslo</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-3 border-brand-black p-3 font-bold focus:outline-none focus:bg-brand-lime/20"
              placeholder="••••••••"
            />
          </div>

          {configError && (
            <div className="bg-red-50 border-2 border-red-500 p-4 rounded">
              <p className="text-red-700 font-bold text-sm">
                {configError}
              </p>
              <p className="text-red-600 text-xs mt-2 font-mono">
                Vytvoř .env soubor v kořenovém adresáři projektu s:<br/>
                VITE_SUPABASE_URL=https://tvuj-projekt.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=tvuj_anon_key
              </p>
            </div>
          )}
          
          {error && !configError && (
            <p className="text-red-600 font-bold text-sm border-t border-red-300 pt-2">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth className="text-lg" disabled={loading || !!configError}>
            {loading
              ? (isLogin ? 'Přihlašování...' : 'Registrace...')
              : (isLogin ? 'Přihlásit se' : 'Registrovat')}
          </Button>

        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm font-bold">
            {isLogin ? 'Ještě nemáš účet?' : 'Už jsi členem?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 underline decoration-2 underline-offset-2 hover:text-brand-pink"
            >
              {isLogin ? 'Registruj se' : 'Přihlas se'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;