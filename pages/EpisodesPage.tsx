import React, { useEffect, useState } from 'react';
import EpisodeCard from '../components/EpisodeCard';
import { Episode } from '../types';
import { supabase } from '../supabaseClient';

interface EpisodesPageProps {
  onEpisodeClick: (id: string) => void;
}

const EpisodesPage: React.FC<EpisodesPageProps> = ({ onEpisodeClick }) => {
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
      <h1 className="text-4xl font-black uppercase text-brand-pink text-center mb-8 drop-shadow-[4px_4px_0px_#000]">
        VŠECHNY EPIZODY
      </h1>

      {/* Feed */}
      <div className="flex flex-col gap-6">
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

export default EpisodesPage;

