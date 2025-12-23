import React from 'react';
import { Episode } from '../types';
import { PlayCircle } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  onClick: (id: string) => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onClick }) => {
  return (
    <div 
      onClick={() => onClick(episode.id)}
      className="group bg-white border-3 border-brand-black p-6 mb-8 relative shadow-hard cursor-pointer transition-all hover:shadow-hard-hover hover:-translate-y-1"
    >
      {/* New Tag */}
      {episode.isNew && (
        <div className="absolute -top-4 -right-4 bg-brand-lime border-3 border-brand-black px-3 py-1 font-black text-sm uppercase shadow-sm rotate-3">
          NEW
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold uppercase leading-tight group-hover:text-brand-pink transition-colors">
          {episode.title}
        </h2>
        
        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
           {new Date(episode.publishedAt).toLocaleDateString('cs-CZ')}
        </div>

        <p className="text-lg font-medium line-clamp-2 border-l-4 border-brand-lime pl-4 my-2">
          {/* Simple strip markdown for preview */}
          {episode.bonusText.replace(/[#*]/g, '').substring(0, 100)}...
        </p>

        <div className="mt-2 flex items-center gap-2 font-bold text-brand-pink uppercase text-sm">
          <PlayCircle size={20} />
          <span>Poslechnout & Bonus</span>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;