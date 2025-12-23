import React from 'react';
import Button from '../components/Button';
import { APP_NAME } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
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

          {/* Non-functional Preview Card */}
          <div className="opacity-75 pointer-events-none blur-[1px] select-none scale-95 grayscale">
            <div className="bg-white border-3 border-brand-black p-8 shadow-hard">
               <div className="bg-brand-lime w-16 h-6 border-3 border-brand-black mb-4"></div>
               <div className="h-8 bg-black w-3/4 mb-4"></div>
               <div className="h-4 bg-gray-300 w-full mb-2"></div>
               <div className="h-4 bg-gray-300 w-full mb-2"></div>
               <div className="h-4 bg-gray-300 w-5/6 mb-6"></div>
               <div className="h-10 bg-brand-pink w-1/3 border-3 border-brand-black"></div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="font-bold italic text-lg">...a mnohem víc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;