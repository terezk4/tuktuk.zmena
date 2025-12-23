import React from 'react';
import { MOCK_CHALLENGE } from '../constants';

const CommunityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <h1 className="text-4xl font-black uppercase mb-8 text-center">Týdenní Výzva</h1>
       
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
            {MOCK_CHALLENGE.title}
          </h2>
          <p className="text-xl font-bold text-center leading-relaxed">
            {MOCK_CHALLENGE.content}
          </p>
       </div>

       <div className="text-center mt-16">
         <p className="font-bold text-gray-400 uppercase">Diskuse k výzvě (Coming Soon in v1.1)</p>
       </div>
    </div>
  );
};

export default CommunityPage;