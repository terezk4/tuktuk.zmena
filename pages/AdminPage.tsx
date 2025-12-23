import React, { useState } from 'react';
import Button from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { User } from '../types';
import { Navigate } from 'react-router-dom';
import { ADMIN_EMAILS } from '../constants';

interface AdminPageProps {
  user: User | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  // Access Control
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState<'episode' | 'challenge'>('episode');
  const [successMsg, setSuccessMsg] = useState('');

  // Episode Form State
  const [epTitle, setEpTitle] = useState('');
  const [epUrl, setEpUrl] = useState('');
  const [epBonus, setEpBonus] = useState('');
  const [epUrlError, setEpUrlError] = useState('');

  // Challenge Form State
  const [chTitle, setChTitle] = useState('');
  const [chContent, setChContent] = useState('');

  const validateSpotifyUrl = (url: string) => {
    const regex = /open\.spotify\.com\/episode\/[a-zA-Z0-9]+/;
    return regex.test(url);
  };

  const handleEpisodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSpotifyUrl(epUrl)) {
      setEpUrlError('Neplatná Spotify URL. Musí obsahovat open.spotify.com/episode/');
      return;
    }
    setEpUrlError('');
    
    // Simulate API call
    console.log({ title: epTitle, url: epUrl, bonus: epBonus });
    showSuccess('EPIZODA PUBLIKOVÁNA!');
    
    // Reset
    setEpTitle('');
    setEpUrl('');
    setEpBonus('');
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log({ title: chTitle, content: chContent });
    showSuccess('VÝZVA PUBLIKOVÁNA!');

    // Reset
    setChTitle('');
    setChContent('');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-4xl font-black uppercase text-brand-pink text-center mb-8 drop-shadow-[4px_4px_0px_#000]">
        ADMIN PANEL
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-0 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('episode')}
          className={`
            px-6 py-3 font-black uppercase text-lg border-3 border-brand-black shadow-hard
            transition-all duration-200
            ${activeTab === 'episode' ? 'bg-brand-pink text-white translate-y-1 shadow-none' : 'bg-white text-brand-black hover:bg-gray-50'}
          `}
        >
          NOVÁ EPIZODA
        </button>
        <button
          onClick={() => setActiveTab('challenge')}
          className={`
            px-6 py-3 font-black uppercase text-lg border-3 border-brand-black shadow-hard
            transition-all duration-200
            ${activeTab === 'challenge' ? 'bg-brand-pink text-white translate-y-1 shadow-none' : 'bg-white text-brand-black hover:bg-gray-50'}
          `}
        >
          NOVÁ VÝZVA
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="bg-white border-3 border-brand-black p-6 md:p-8 shadow-hard mt-4 relative">
        
        {/* Success Toast */}
        {successMsg && (
          <div className="absolute top-0 left-0 w-full bg-brand-lime border-b-3 border-brand-black p-4 text-center font-black animate-pulse z-10">
            ✓ {successMsg}
          </div>
        )}

        {activeTab === 'episode' ? (
          <form onSubmit={handleEpisodeSubmit} className="flex flex-col gap-6">
            <Input 
              label="Název epizody" 
              placeholder="např. Epizoda 42: Jak zvládat stres" 
              required
              value={epTitle}
              onChange={e => setEpTitle(e.target.value)}
            />
            
            <Input 
              label="Spotify URL" 
              placeholder="https://open.spotify.com/episode/..." 
              required
              error={epUrlError}
              value={epUrl}
              onChange={e => setEpUrl(e.target.value)}
            />

            <TextArea 
              label="Bonusový obsah (Markdown)" 
              placeholder={`# Nadpis\n\nTvůj **tučný** text...`}
              required
              rows={15}
              value={epBonus}
              onChange={e => setEpBonus(e.target.value)}
            />

            <Button type="submit" fullWidth className="h-[60px] text-xl">
              PUBLIKOVAT EPIZODU
            </Button>
          </form>
        ) : (
          <form onSubmit={handleChallengeSubmit} className="flex flex-col gap-6">
            <Input 
              label="Název výzvy" 
              placeholder="např. Týden bez sociálních sítí" 
              required
              value={chTitle}
              onChange={e => setChTitle(e.target.value)}
            />
            
            <TextArea 
              label="Obsah výzvy (Markdown)" 
              placeholder={`## Tvoje výzva\n\nPopis výzvy...`}
              required
              rows={15}
              value={chContent}
              onChange={e => setChContent(e.target.value)}
            />

            <Button type="submit" fullWidth className="h-[60px] text-xl">
              PUBLIKOVAT VÝZVU
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPage;