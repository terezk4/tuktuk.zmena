import React, { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError || !data.user) {
          throw signInError || new Error('Nepodařilo se přihlásit.');
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
        if (signUpError || !data.user) {
          throw signUpError || new Error('Registrace selhala.');
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
      setError(err.message || 'Nastala chyba. Zkus to prosím znovu.');
    } finally {
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

          {error && (
            <p className="text-red-600 font-bold text-sm border-t border-red-300 pt-2">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth className="text-lg" disabled={loading}>
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

          <div className="text-xs text-gray-400 font-mono border-t border-gray-200 pt-2">
             <p>Pro Admin přístup použij:</p>
             <p>admin@tuktukzmena.cz</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;