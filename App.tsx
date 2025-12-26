import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';
import { User, Episode } from './types';
import { supabase } from './supabaseClient';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-pink p-4">
          <div className="bg-white border-3 border-brand-black p-8 shadow-hard max-w-md w-full">
            <h1 className="text-2xl font-black uppercase mb-4 text-red-600">Chyba aplikace</h1>
            <p className="font-bold mb-4">{this.state.error?.message || 'Nastala neočekávaná chyba.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-pink text-black border-3 border-black px-6 py-3 font-black uppercase shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              Obnovit stránku
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep auth state in sync with Supabase session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { ADMIN_EMAILS } = await import('./constants');
        const isAdmin = ADMIN_EMAILS.includes(data.user.email ?? '');
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          role: isAdmin ? 'admin' : 'user',
        });
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { ADMIN_EMAILS } = await import('./constants');
        const isAdmin = ADMIN_EMAILS.includes(session.user.email ?? '');
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          role: isAdmin ? 'admin' : 'user',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    navigate('/feed');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user state immediately after signOut
    navigate('/');
  };

  const handleEpisodeClick = (id: string) => {
    navigate(`/episode/${id}`);
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={(path) => navigate(path)}
      currentPath={location.pathname}
    >
      <Routes>
        <Route path="/" element={<LandingPage onEnter={() => user ? navigate('/feed') : navigate('/auth')} />} />
        <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
        
        <Route path="/feed" element={
          <ProtectedRoute user={user}>
            <HomePage onEpisodeClick={handleEpisodeClick} />
          </ProtectedRoute>
        } />
        
        <Route path="/community" element={
          <ProtectedRoute user={user}>
            <CommunityPage />
          </ProtectedRoute>
        } />

        <Route path="/episode/:id" element={
          <ProtectedRoute user={user}>
             <EpisodeDetailWrapper user={user} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute user={user}>
             <AdminPage user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

// Wrapper to extract ID and load episode from Supabase
const EpisodeDetailWrapper: React.FC<{ user: User | null }> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [episode, setEpisode] = React.useState<Episode | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const pathParts = location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  React.useEffect(() => {
    const fetchEpisode = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Epizodu se nepodařilo načíst.');
        setLoading(false);
        return;
      }

      const created = data.created_at ? new Date(data.created_at) : new Date();
      const isNew = Date.now() - created.getTime() < 48 * 60 * 60 * 1000;

      setEpisode({
        id: data.id,
        title: data.title,
        spotifyUrl: data.spotify_url,
        bonusText: data.bonus_text,
        publishedAt: created.toISOString(),
        isNew,
      });
      setLoading(false);
    };

    fetchEpisode();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center font-bold text-xl">Načítám epizodu...</div>;
  }

  if (error || !episode) {
    return <div className="p-8 text-center font-bold text-xl">Epizodu se nepodařilo načíst.</div>;
  }

  return <EpisodeDetailPage episode={episode} currentUser={user} onBack={() => navigate('/feed')} />;
};


const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;