import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { APP_NAME } from '../constants';
import { Challenge } from '../types';
import { supabase } from '../supabaseClient';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoadingChallenge(true);
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no challenge exists, that's okay
        if (error.code !== 'PGRST116') {
          console.error('Error loading challenge:', error);
        }
        setLoadingChallenge(false);
        return;
      }

      if (data) {
        setChallenge({
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: data.created_at || new Date().toISOString(),
        });
      }
      setLoadingChallenge(false);
    };

    fetchChallenge();
  }, []);

  return (
    <div className="bg-brand-white">
      {/* Hero Section */}
      <div className="bg-brand-pink min-h-[60vh] flex flex-col items-center justify-center p-6 border-b-3 border-brand-black text-center relative overflow-hidden">
        
        {/* Decorative elements behind */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-brand-lime border-3 border-brand-black shadow-hard opacity-50 rotate-12 hidden md:block"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white border-3 border-brand-black shadow-hard rounded-full opacity-50 hidden md:block"></div>

        <h1 className="text-6xl md:text-8xl font-black uppercase text-brand-black drop-shadow-[4px_4px_0px_#FFF] mb-6 tracking-tighter leading-none transform -rotate-2">
          {APP_NAME}
        </h1>
        
        <p className="text-xl md:text-2xl font-bold bg-white inline-block px-4 py-2 border-3 border-brand-black shadow-hard mb-10 max-w-2xl transform rotate-1">
          Podcast, který tě nenechá v klidu. Teď i s komunitou.
        </p>

        <Button onClick={onEnter} variant="secondary" className="text-xl px-12 py-4">
          Vstoupit do komunity
        </Button>
      </div>

      {/* Preview Section */}
      <div className="py-20 px-4 flex flex-col items-center bg-white pattern-grid">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
             <h2 className="text-3xl font-black uppercase mb-2">Co je uvnitř?</h2>
             <p className="font-bold text-gray-500">Exkluzivní obsah, který na Spotify nenajdeš.</p>
          </div>

          {/* Current Challenge */}
          {loadingChallenge ? (
            <div className="text-center font-bold py-8">Načítám výzvu...</div>
          ) : challenge ? (
            <div className="relative bg-brand-lime border-3 border-brand-black p-6 md:p-8 shadow-hard mb-4">
              {/* Tail of speech bubble */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0 
                border-l-[20px] border-l-transparent
                border-r-[20px] border-r-transparent
                border-t-[24px] border-t-brand-black">
              </div>
              <div className="absolute -bottom-[20px] left-1/2 transform -translate-x-1/2 w-0 h-0 
                border-l-[16px] border-l-transparent
                border-r-[16px] border-r-transparent
                border-t-[20px] border-t-brand-lime z-10">
              </div>

              <h3 className="text-2xl md:text-3xl font-black uppercase text-center mb-3 leading-none">
                {challenge.title}
              </h3>
              <div className="text-lg md:text-xl font-bold text-center leading-relaxed whitespace-pre-line">
                {challenge.content}
              </div>
            </div>
          ) : (
            <div className="bg-white border-3 border-brand-black p-8 shadow-hard opacity-75">
              <div className="text-center font-bold text-gray-400">
                Zatím žádná výzva. Přidej první v admin sekci.
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <p className="font-bold italic text-lg">...a mnohem víc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;