import React, { useEffect, useState } from 'react';
import { Episode, Comment, User } from '../types';
import Button from '../components/Button';
import { ADMIN_EMAILS } from '../constants';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface EpisodeDetailPageProps {
  episode: Episode;
  currentUser: User | null;
  onBack: () => void;
}

// Simple Markdown Renderer
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        if (line.trim().startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-black text-brand-pink uppercase mb-4">{line.replace('# ', '')}</h1>
        }
        if (line.trim().startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-brand-pink mt-6 mb-2">{line.replace('## ', '')}</h2>
        }
        if (line.trim().startsWith('- ')) {
          return <li key={idx} className="list-disc ml-5 font-bold">{line.replace('- ', '')}</li>
        }
        if (line.trim() === '') return <br key={idx} />;
        
        const parts = line.split('**');
        return (
          <p key={idx} className="text-lg leading-relaxed font-medium">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-black">{part}</strong> : part)}
          </p>
        );
      })}
    </div>
  );
};

const EpisodeDetailPage: React.FC<EpisodeDetailPageProps> = ({ episode, currentUser, onBack }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      setCommentError(null);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('episode_id', episode.id)
        .order('created_at', { ascending: false });

      if (error) {
        setCommentError('Nepodařilo se načíst komentáře.');
        setLoadingComments(false);
        return;
      }

      const mapped: Comment[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        username: 'uživatel', // Simplified; you can later join profiles for nicer names
        content: row.content,
        createdAt: new Date(row.created_at).toLocaleString('cs-CZ'),
        episodeId: row.episode_id,
      }));

      setComments(mapped);
      setLoadingComments(false);
    };

    fetchComments();
  }, [episode.id]);

  const getSpotifyEmbedUrl = (url: string) => {
    try {
      const match = url.match(/episode\/([a-zA-Z0-9]+)/);
      const id = match ? match[1] : '';
      return `https://open.spotify.com/embed/episode/${id}`;
    } catch (e) {
      return '';
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        content: newComment,
        user_id: currentUser.id,
        episode_id: episode.id,
      })
      .select('*')
      .single();

    if (error || !data) {
      setCommentError('Komentář se nepodařilo odeslat.');
      return;
    }

    const inserted: Comment = {
      id: data.id,
      userId: data.user_id,
      username: 'uživatel',
      content: data.content,
      createdAt: new Date(data.created_at).toLocaleString('cs-CZ'),
      episodeId: data.episode_id,
    };

    setComments([inserted, ...comments]);
    setNewComment('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Opravdu smazat tento komentář?')) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      setCommentError('Komentář se nepodařilo smazat.');
      return;
    }

    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 flex flex-col items-center">
      
      <div className="w-full">
        <button onClick={onBack} className="flex items-center gap-2 font-bold hover:text-brand-pink mb-6 uppercase tracking-wider">
          <ArrowLeft size={20} /> Zpět na feed
        </button>
      </div>

      {/* 1. Episode Title */}
      <h1 className="w-full text-4xl md:text-5xl font-black uppercase text-brand-pink drop-shadow-[4px_4px_0px_#000] mb-8 leading-none text-center md:text-left">
        {episode.title}
      </h1>

      {/* 2. Spotify Player */}
      <div className="w-full mb-8 border-3 border-brand-black shadow-hard bg-black">
        <iframe 
          style={{ borderRadius: '0px' }} 
          src={getSpotifyEmbedUrl(episode.spotifyUrl)} 
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Embed"
        ></iframe>
      </div>

      {/* 3. Bonus Text */}
      <div className="w-full bg-white border-3 border-brand-black p-6 md:p-8 shadow-hard mb-12">
        <div className="prose prose-lg text-brand-black max-w-none">
           <SimpleMarkdown content={episode.bonusText} />
        </div>
      </div>

      {/* 4. Comments Section */}
      <div className="w-full border-t-3 border-black pt-8">
        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
          <span className="bg-brand-lime px-2 border-2 border-black">?</span> 
          Co si o tom myslíš?
        </h3>

        {commentError && (
          <p className="text-red-600 font-bold mb-4">{commentError}</p>
        )}

        {/* Comment Form */}
        <form onSubmit={handlePostComment} className="mb-10 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-3 border-brand-black p-4 font-bold min-h-[120px] focus:outline-none focus:bg-brand-pink/10 resize-none shadow-hard-sm"
            placeholder="Napiš svůj názor..."
          />
          <div className="absolute bottom-4 right-4">
             <Button type="submit" disabled={!newComment.trim()}>
                <div className="flex items-center gap-2 text-sm">
                   ODESLAT <Send size={16} />
                </div>
             </Button>
          </div>
        </form>

        {/* List */}
        <div className="flex flex-col gap-6">
          {loadingComments && (
            <p className="text-center font-bold text-gray-500">Načítám komentáře...</p>
          )}
          {!loadingComments && comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 border-2 border-black p-4 relative shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="font-black text-brand-pink uppercase">{comment.username}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase">{comment.createdAt}</span>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs font-bold text-white bg-black px-2 py-1 border-2 border-black hover:bg-red-600 transition-colors"
                  >
                    SMAZAT
                  </button>
                )}
              </div>
              <p className="font-medium text-lg leading-snug">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center font-bold text-gray-400 italic">Zatím žádné komentáře. Buď první!</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default EpisodeDetailPage;