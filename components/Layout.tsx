import React, { useState } from 'react';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { APP_NAME } from '../constants';
import Button from './Button';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentPath }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'DOMŮ', path: '/' },
    { label: 'KOMUNITA', path: '/community' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ label: 'ADMIN', path: '/admin' });
  }

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-brand-black">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-brand-black border-b-3 border-brand-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('/')} 
            className="cursor-pointer text-xl sm:text-2xl font-black italic tracking-tighter hover:text-brand-pink transition-colors"
          >
            {APP_NAME}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {user && navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-sm font-bold uppercase tracking-wide hover:text-brand-lime transition-colors ${currentPath === link.path ? 'text-brand-lime underline decoration-2 underline-offset-4' : ''}`}
              >
                {link.label}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 border-l-2 border-gray-700 pl-4">
                 <button 
                   onClick={() => handleNav('/profile')} 
                   className="text-brand-lime hover:text-white" 
                   title="Profil"
                 >
                   <UserIcon size={20} />
                 </button>
                 <span className="text-xs font-bold text-gray-400 hidden lg:block">{user.email}</span>
                 <button onClick={onLogout} className="text-brand-pink hover:text-white" title="Logout">
                   <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNav('/auth')}
                className="text-brand-lime font-bold uppercase hover:text-white"
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-brand-lime"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-black border-t border-gray-800 p-4">
            <nav className="flex flex-col gap-4">
              {user && navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left text-lg font-bold uppercase ${currentPath === link.path ? 'text-brand-lime' : 'text-white'}`}
                >
                  {link.label}
                </button>
              ))}
               {user ? (
                 <>
                   <button 
                     onClick={() => handleNav('/profile')} 
                     className="text-left text-lg font-bold uppercase text-brand-lime flex items-center gap-2"
                   >
                     <UserIcon size={20} /> Profil
                   </button>
                   <button onClick={onLogout} className="text-left text-lg font-bold uppercase text-brand-pink flex items-center gap-2">
                     <LogOut size={20} /> Odhlásit
                   </button>
                 </>
               ) : (
                  <button onClick={() => handleNav('/auth')} className="text-left text-lg font-bold uppercase text-brand-lime">
                    Vstoupit / Registrovat
                  </button>
               )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-white py-8 border-t-3 border-brand-black mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-black text-xl italic mb-2">STAY DISRUPTIVE.</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Ťuk ťuk. Změna!</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;