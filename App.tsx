import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';
import { User, Episode } from './types';
import { MOCK_EPISODES } from './constants';

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

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    navigate('/feed');
  };

  const handleLogout = () => {
    setUser(null);
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

// Wrapper to extract ID and find episode
const EpisodeDetailWrapper: React.FC<{ user: User | null }> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Quick hack to get ID from current URL for this simplified file structure
  const pathParts = location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  const episode = MOCK_EPISODES.find(e => e.id === id);

  if (!episode) return <div className="p-8 text-center font-bold text-xl">Episode not found</div>;

  return <EpisodeDetailPage episode={episode} currentUser={user} onBack={() => navigate('/feed')} />;
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;