import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Input } from '../components/Input';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface ProfilePageProps {
  user: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      // Load current username from user metadata
      const loadUsername = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user?.user_metadata?.username) {
          setUsername(data.user.user_metadata.username);
        }
      };
      loadUsername();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await supabase.auth.updateUser({
      data: { username: username.trim() || null }
    });

    if (error) {
      setErrorMsg(`Chyba při ukládání: ${error.message}`);
      setLoading(false);
      return;
    }

    setSuccessMsg('Uživatelské jméno uloženo!');
    setLoading(false);
    
    // Reload page to update user data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center font-bold text-xl">Musíš se přihlásit, abys mohl upravit profil.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-black uppercase text-brand-pink text-center mb-8 drop-shadow-[4px_4px_0px_#000]">
        MŮJ PROFIL
      </h1>

      <div className="bg-white border-3 border-brand-black p-8 shadow-hard">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-black uppercase text-sm">Email</label>
            <input 
              type="email" 
              value={user.email}
              disabled
              className="border-3 border-gray-300 p-3 font-bold bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500">Email nelze změnit</p>
          </div>

          <Input 
            label="Uživatelské jméno" 
            placeholder="např. Jan Novák"
            value={username}
            onChange={e => setUsername(e.target.value)}
            helpText="Toto jméno se zobrazí u tvých komentářů"
          />

          {successMsg && (
            <div className="bg-brand-lime border-3 border-brand-black p-4 text-center font-bold">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500 text-white border-3 border-brand-black p-4 text-center font-bold">
              {errorMsg}
            </div>
          )}

          <Button type="submit" fullWidth className="h-[60px] text-xl" disabled={loading}>
            {loading ? 'Ukládám...' : 'ULOŽIT'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

