import React from 'react';
import EpisodeCard from '../components/EpisodeCard';
import { MOCK_EPISODES } from '../constants';

interface HomePageProps {
  onEpisodeClick: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEpisodeClick }) => {
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
        {MOCK_EPISODES.map(episode => (
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