import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { User, Episode, Challenge } from '../types';
import { Navigate } from 'react-router-dom';
import { ADMIN_EMAILS } from '../constants';
import { supabase } from '../supabaseClient';

interface AdminPageProps {
  user: User | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  // Access Control
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState<'episode' | 'challenge' | 'manage-episodes' | 'manage-challenges'>('episode');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Episode Form State
  const [epTitle, setEpTitle] = useState('');
  const [epUrl, setEpUrl] = useState('');
  const [epBonus, setEpBonus] = useState('');
  const [epUrlError, setEpUrlError] = useState('');

  // Challenge Form State
  const [chTitle, setChTitle] = useState('');
  const [chContent, setChContent] = useState('');

  // Manage Episodes State
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [editEpTitle, setEditEpTitle] = useState('');
  const [editEpUrl, setEditEpUrl] = useState('');
  const [editEpBonus, setEditEpBonus] = useState('');

  // Manage Challenges State
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [editChTitle, setEditChTitle] = useState('');
  const [editChContent, setEditChContent] = useState('');

  const validateSpotifyUrl = (url: string) => {
    const regex = /open\.spotify\.com\/episode\/[a-zA-Z0-9]+/;
    return regex.test(url);
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSpotifyUrl(epUrl)) {
      setEpUrlError('Neplatná Spotify URL. Musí obsahovat open.spotify.com/episode/');
      return;
    }
    setEpUrlError('');

    const { error } = await supabase
      .from('episodes')
      .insert({
        title: epTitle,
        spotify_url: epUrl,
        bonus_text: epBonus,
      });

    if (error) {
      showError(`Chyba při publikování epizody: ${error.message || 'Neznámá chyba'}`);
      return;
    }

    showSuccess('EPIZODA PUBLIKOVÁNA!');
    
    // Reset
    setEpTitle('');
    setEpUrl('');
    setEpBonus('');

    // Refresh episodes list if on management tab
    if (activeTab === 'manage-episodes') {
      fetchEpisodes();
    }
  };

  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('challenges')
      .insert({
        title: chTitle,
        content: chContent,
      })
      .select();

    if (error) {
      console.error('Error inserting challenge:', error);
      // Detailnější error message pro RLS chyby
      let errorMessage = error.message || 'Neznámá chyba';
      if (error.code === '42501' || error.message?.includes('row-level') || error.message?.includes('policy')) {
        errorMessage = 'Chyba oprávnění: Zkontroluj Row Level Security (RLS) policies v Supabase pro tabulku challenges. Ujisti se, že máte oprávnění pro INSERT.';
      }
      showError(`Chyba při publikování výzvy: ${errorMessage}`);
      return;
    }

    showSuccess('VÝZVA PUBLIKOVÁNA!');

    // Reset
    setChTitle('');
    setChContent('');

    // Refresh challenges list if on management tab
    if (activeTab === 'manage-challenges') {
      fetchChallenges();
    }
  };

  const showSuccess = (msg: string) => {
    setErrorMsg(''); // Clear any existing error
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setSuccessMsg(''); // Clear any existing success message
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000); // Show errors longer
  };

  // Fetch episodes for management
  const fetchEpisodes = async () => {
    setLoadingEpisodes(true);
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError('Nepodařilo se načíst epizody.');
      setLoadingEpisodes(false);
      return;
    }

    const mapped: Episode[] = (data || []).map((row: any) => {
      const created = row.created_at ? new Date(row.created_at) : new Date();
      const isNew = Date.now() - created.getTime() < 48 * 60 * 60 * 1000;
      return {
        id: row.id,
        title: row.title,
        spotifyUrl: row.spotify_url,
        bonusText: row.bonus_text,
        publishedAt: created.toISOString(),
        isNew,
      };
    });

    setEpisodes(mapped);
    setLoadingEpisodes(false);
  };

  // Fetch challenges for management
  const fetchChallenges = async () => {
    setLoadingChallenges(true);
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError('Nepodařilo se načíst výzvy.');
      setLoadingChallenges(false);
      return;
    }

    const mapped: Challenge[] = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at || new Date().toISOString(),
    }));

    setChallenges(mapped);
    setLoadingChallenges(false);
  };

  // Load data when switching to management tabs
  useEffect(() => {
    if (activeTab === 'manage-episodes') {
      fetchEpisodes();
    } else if (activeTab === 'manage-challenges') {
      fetchChallenges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Delete episode
  const handleDeleteEpisode = async (id: string) => {
    if (!confirm('Opravdu chceš smazat tuto epizodu?')) return;

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id);

    if (error) {
      showError(`Chyba při mazání epizody: ${error.message}`);
      return;
    }

    showSuccess('EPIZODA SMAZÁNA!');
    fetchEpisodes();
  };

  // Update episode
  const handleUpdateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode) return;

    if (!validateSpotifyUrl(editEpUrl)) {
      showError('Neplatná Spotify URL. Musí obsahovat open.spotify.com/episode/');
      return;
    }

    const { error } = await supabase
      .from('episodes')
      .update({
        title: editEpTitle,
        spotify_url: editEpUrl,
        bonus_text: editEpBonus,
      })
      .eq('id', editingEpisode.id);

    if (error) {
      showError(`Chyba při aktualizaci epizody: ${error.message}`);
      return;
    }

    showSuccess('EPIZODA AKTUALIZOVÁNA!');
    setEditingEpisode(null);
    fetchEpisodes();
  };

  // Delete challenge
  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Opravdu chceš smazat tuto výzvu?')) return;

    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting challenge:', error);
      let errorMessage = error.message || 'Neznámá chyba';
      if (error.code === '42501' || error.message?.includes('row-level') || error.message?.includes('policy')) {
        errorMessage = 'Chyba oprávnění: Zkontroluj Row Level Security (RLS) policies v Supabase pro tabulku challenges. Ujisti se, že máte oprávnění pro DELETE.';
      }
      showError(`Chyba při mazání výzvy: ${errorMessage}`);
      return;
    }

    showSuccess('VÝZVA SMAZÁNA!');
    fetchChallenges();
  };

  // Update challenge
  const handleUpdateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;

    const { error } = await supabase
      .from('challenges')
      .update({
        title: editChTitle,
        content: editChContent,
      })
      .eq('id', editingChallenge.id);

    if (error) {
      console.error('Error updating challenge:', error);
      let errorMessage = error.message || 'Neznámá chyba';
      if (error.code === '42501' || error.message?.includes('row-level') || error.message?.includes('policy')) {
        errorMessage = 'Chyba oprávnění: Zkontroluj Row Level Security (RLS) policies v Supabase pro tabulku challenges. Ujisti se, že máte oprávnění pro UPDATE.';
      }
      showError(`Chyba při aktualizaci výzvy: ${errorMessage}`);
      return;
    }

    showSuccess('VÝZVA AKTUALIZOVÁNA!');
    setEditingChallenge(null);
    fetchChallenges();
  };

  // Start editing episode
  const startEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setEditEpTitle(episode.title);
    setEditEpUrl(episode.spotifyUrl);
    setEditEpBonus(episode.bonusText);
  };

  // Start editing challenge
  const startEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setEditChTitle(challenge.title);
    setEditChContent(challenge.content);
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
            transition-all duration-200 whitespace-nowrap
            ${activeTab === 'episode' ? 'bg-brand-pink text-white translate-y-1 shadow-none' : 'bg-white text-brand-black hover:bg-gray-50'}
          `}
        >
          NOVÁ EPIZODA
        </button>
        <button
          onClick={() => setActiveTab('challenge')}
          className={`
            px-6 py-3 font-black uppercase text-lg border-3 border-brand-black shadow-hard
            transition-all duration-200 whitespace-nowrap
            ${activeTab === 'challenge' ? 'bg-brand-pink text-white translate-y-1 shadow-none' : 'bg-white text-brand-black hover:bg-gray-50'}
          `}
        >
          NOVÁ VÝZVA
        </button>
        <button
          onClick={() => setActiveTab('manage-episodes')}
          className={`
            px-6 py-3 font-black uppercase text-lg border-3 border-brand-black shadow-hard
            transition-all duration-200 whitespace-nowrap
            ${activeTab === 'manage-episodes' ? 'bg-brand-pink text-white translate-y-1 shadow-none' : 'bg-white text-brand-black hover:bg-gray-50'}
          `}
        >
          SPRÁVA EPIZOD
        </button>
        <button
          onClick={() => setActiveTab('manage-challenges')}
          className={`
            px-6 py-3 font-black uppercase text-lg border-3 border-brand-black shadow-hard
            transition-all duration-200 whitespace-nowrap
            ${activeTab === 'manage-challenges' ? 'bg-brand-pink text-white translate-y-1 shadow-none' : 'bg-white text-brand-black hover:bg-gray-50'}
          `}
        >
          SPRÁVA VÝZEV
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

        {/* Error Toast */}
        {errorMsg && (
          <div className="absolute top-0 left-0 w-full bg-red-600 text-white border-b-3 border-brand-black p-4 text-center font-black animate-pulse z-10">
            ✗ {errorMsg}
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
        ) : activeTab === 'challenge' ? (
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
        ) : activeTab === 'manage-episodes' ? (
          <div className="flex flex-col gap-4">
            {loadingEpisodes ? (
              <div className="text-center font-bold py-8">Načítám epizody...</div>
            ) : episodes.length === 0 ? (
              <div className="text-center font-bold text-gray-400 py-8">Zatím žádné epizody.</div>
            ) : editingEpisode ? (
              <form onSubmit={handleUpdateEpisode} className="flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase">Upravit epizodu</h3>
                  <button
                    type="button"
                    onClick={() => setEditingEpisode(null)}
                    className="px-4 py-2 border-3 border-brand-black bg-gray-200 font-bold hover:bg-gray-300"
                  >
                    Zrušit
                  </button>
                </div>
                <Input 
                  label="Název epizody" 
                  required
                  value={editEpTitle}
                  onChange={e => setEditEpTitle(e.target.value)}
                />
                <Input 
                  label="Spotify URL" 
                  required
                  value={editEpUrl}
                  onChange={e => setEditEpUrl(e.target.value)}
                />
                <TextArea 
                  label="Bonusový obsah (Markdown)" 
                  required
                  rows={15}
                  value={editEpBonus}
                  onChange={e => setEditEpBonus(e.target.value)}
                />
                <Button type="submit" fullWidth className="h-[60px] text-xl">
                  ULOŽIT ZMĚNY
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div key={episode.id} className="border-3 border-brand-black p-4 bg-white shadow-hard">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black uppercase flex-1">{episode.title}</h3>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditEpisode(episode)}
                          className="px-4 py-2 border-3 border-brand-black bg-brand-lime font-bold hover:bg-brand-lime/80"
                        >
                          UPRAVIT
                        </button>
                        <button
                          onClick={() => handleDeleteEpisode(episode.id)}
                          className="px-4 py-2 border-3 border-brand-black bg-red-500 text-white font-bold hover:bg-red-600"
                        >
                          SMAZAT
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{episode.spotifyUrl}</p>
                    <p className="text-xs text-gray-400">
                      Vytvořeno: {new Date(episode.publishedAt).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'manage-challenges' ? (
          <div className="flex flex-col gap-4">
            {loadingChallenges ? (
              <div className="text-center font-bold py-8">Načítám výzvy...</div>
            ) : challenges.length === 0 ? (
              <div className="text-center font-bold text-gray-400 py-8">Zatím žádné výzvy.</div>
            ) : editingChallenge ? (
              <form onSubmit={handleUpdateChallenge} className="flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase">Upravit výzvu</h3>
                  <button
                    type="button"
                    onClick={() => setEditingChallenge(null)}
                    className="px-4 py-2 border-3 border-brand-black bg-gray-200 font-bold hover:bg-gray-300"
                  >
                    Zrušit
                  </button>
                </div>
                <Input 
                  label="Název výzvy" 
                  required
                  value={editChTitle}
                  onChange={e => setEditChTitle(e.target.value)}
                />
                <TextArea 
                  label="Obsah výzvy (Markdown)" 
                  required
                  rows={8}
                  value={editChContent}
                  onChange={e => setEditChContent(e.target.value)}
                />
                <Button type="submit" fullWidth className="h-[60px] text-xl">
                  ULOŽIT ZMĚNY
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="border-3 border-brand-black p-4 bg-white shadow-hard">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black uppercase flex-1">{challenge.title}</h3>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditChallenge(challenge)}
                          className="px-4 py-2 border-3 border-brand-black bg-brand-lime font-bold hover:bg-brand-lime/80"
                        >
                          UPRAVIT
                        </button>
                        <button
                          onClick={() => handleDeleteChallenge(challenge.id)}
                          className="px-4 py-2 border-3 border-brand-black bg-red-500 text-white font-bold hover:bg-red-600"
                        >
                          SMAZAT
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{challenge.content}</p>
                    <p className="text-xs text-gray-400">
                      Vytvořeno: {new Date(challenge.createdAt).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminPage;