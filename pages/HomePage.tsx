import React, { useEffect, useState } from 'react';
import EpisodeCard from '../components/EpisodeCard';
import { Episode } from '../types';
import { supabase } from '../supabaseClient';

interface HomePageProps {
  onEpisodeClick: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEpisodeClick }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Nepodařilo se načíst epizody.');
        setLoading(false);
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
      setLoading(false);
    };

    fetchEpisodes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Hero Banner (Optional) */}
      <div className="bg-brand-lime border-3 border-brand-black p-4 mb-10 text-center shadow-hard rotate-1">
        <h2 className="text-2xl md:text-3xl font-black uppercase">
          Týdenní výzva: Piš si deník!
        </h2>
      </div>

      {/* Feed */}
      <div className="flex flex-col">
        {loading && (
          <div className="text-center font-bold py-8">Načítám epizody...</div>
        )}
        {error && !loading && (
          <div className="text-center font-bold text-red-600 py-8">
            {error}
          </div>
        )}
        {!loading && !error && episodes.length === 0 && (
          <div className="text-center font-bold text-gray-400 py-8">
            Zatím žádné epizody. Přidej první v admin sekci.
          </div>
        )}
        {!loading && !error && episodes.map((episode) => (
          <EpisodeCard 
            key={episode.id} 
            episode={episode} 
            onClick={onEpisodeClick} 
          />
        ))}
      </div>
      
    </div>
  );
};

export default HomePage;