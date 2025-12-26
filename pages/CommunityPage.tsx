import React, { useState, useEffect } from 'react';
import { Challenge } from '../types';
import { supabase } from '../supabaseClient';

const CommunityPage: React.FC = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no challenge exists, that's okay
        if (error.code !== 'PGRST116') {
          setError('Nepodařilo se načíst výzvu.');
        }
        setLoading(false);
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
      setLoading(false);
    };

    fetchChallenge();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <h1 className="text-4xl font-black uppercase mb-8 text-center">Týdenní Výzva</h1>
       
       {loading ? (
         <div className="text-center font-bold py-8">Načítám výzvu...</div>
       ) : error ? (
         <div className="text-center font-bold text-red-600 py-8">{error}</div>
       ) : !challenge ? (
         <div className="text-center font-bold text-gray-400 py-8">
           Zatím žádná výzva. Přidej první v admin sekci.
         </div>
       ) : (
         <>
           {/* Speech Bubble Challenge Container */}
           <div className="relative bg-brand-lime border-3 border-brand-black p-8 md:p-12 shadow-hard mb-12">
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

              <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-4 leading-none">
                {challenge.title}
              </h2>
              <div className="text-xl font-bold text-center leading-relaxed whitespace-pre-line">
                {challenge.content}
              </div>
           </div>

           <div className="text-center mt-16">
             <p className="font-bold text-gray-400 uppercase">Diskuse k výzvě (Coming Soon in v1.1)</p>
           </div>
         </>
       )}
    </div>
  );
};

export default CommunityPage;