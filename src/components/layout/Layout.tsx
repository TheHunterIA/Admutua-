import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, MapPin, Phone, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useFirestoreDoc } from '../../hooks/useFirestore';

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Nossa Igreja', href: '/sobre' },
  { name: 'Cultos', href: '/cultos' },
  { name: 'Departamentos', href: '/departamentos' },
  { name: 'EBD', href: '/ebd' },
  { name: 'Congregações', href: '/congregacoes' },
  { name: 'Liderança', href: '/lideranca' },
  { name: 'Missões', href: '/missoes' },
  { name: 'Contato', href: '/contato' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { data: contactConfig } = useFirestoreDoc<any>('config', 'contact');
  const { data: siteConfig } = useFirestoreDoc<any>('config', 'site');

  const isAdminPage = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    if (isAdminPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAdminPage]);

  if (isAdminPage) {
    return (
      <div className="h-screen flex flex-col bg-pearl font-sans text-church-text overflow-hidden">
        <header className="h-24 md:h-28 flex-shrink-0 flex items-center justify-end px-6 md:px-12 border-b border-church-blue/5">
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="bg-church-blue text-pearl p-3 rounded-2xl hover:bg-church-blue-light transition-all shadow-lg shadow-church-blue/20"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-church-blue/40 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Side Drawer */}
        <div 
          className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-br from-church-blue to-church-blue-light text-pearl shadow-2xl z-50 transform transition-transform duration-700 ease-in-out flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-10">
            <span className="font-serif text-2xl italic tracking-tight">Menu</span>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="text-pearl/60 hover:text-pearl focus:outline-none p-2 transition-colors"
            >
              <X size={32} strokeWidth={1} />
            </button>
          </div>
          <div className="px-10 pb-10 space-y-6 overflow-y-auto flex-1">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link 
                  to={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-xl font-serif tracking-tight transition-all duration-500 hover:pl-4 ${
                    location.pathname === link.href 
                      ? 'text-church-vibrant italic' 
                      : 'text-pearl/80 hover:text-pearl'
                  }`}
                >
                  {link.name}
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="h-px bg-white/5 w-full" />
                )}
              </React.Fragment>
            ))}
            <div className="pt-12 space-y-6">
              <Link 
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.3em] uppercase text-pearl/40 hover:text-pearl transition-colors"
              >
                <LayoutDashboard size={16} />
                Painel Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl font-sans text-church-text flex flex-col">
      
      {/* Header / Navegação */}
      <header className="fixed top-0 w-full z-40">
        {/* Top Bar */}
        {!isAdminPage && (
          <div className="bg-church-blue text-pearl/60 py-2 px-6 md:px-12 border-b border-white/5">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em]">
              <div className="flex gap-6">
                <span className="flex items-center gap-2"><MapPin size={10} className="text-church-vibrant" /> São Gonçalo, RJ</span>
                <span className="hidden sm:flex items-center gap-2"><Phone size={10} className="text-church-vibrant" /> {contactConfig?.phone || '(21) 2713-5394'}</span>
              </div>
              <div className="flex gap-6">
                <a href={contactConfig?.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="hover:text-church-vibrant transition-colors">YouTube</a>
              </div>
            </div>
          </div>
        )}

        <div className="bg-pearl/90 backdrop-blur-md border-b border-church-blue/5">
          <div className="px-6 md:px-12">
            <div className="flex justify-between items-center h-24 md:h-28">
              
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-4 group">
                <div className="relative">
                  <img 
                    src={siteConfig?.footerBannerUrl || "/banner.png"} 
                    alt="AD Mutuá" 
                    className="h-20 md:h-24 w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="hidden sm:block border-l border-church-blue/10 pl-4">
                  <span className="block font-serif text-lg md:text-xl tracking-tight leading-none text-church-blue">AD Mutuá</span>
                  <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-church-muted mt-1">Assembleia de Deus</span>
                </div>
              </Link>

              {/* Menu Button */}
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className="bg-church-blue text-pearl p-3 rounded-2xl hover:bg-church-blue-light transition-all shadow-lg shadow-church-blue/20"
                >
                  <Menu size={24} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-church-blue/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-br from-church-blue to-church-blue-light text-pearl shadow-2xl z-50 transform transition-transform duration-700 ease-in-out flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-10">
          <span className="font-serif text-2xl italic tracking-tight">Menu</span>
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="text-pearl/60 hover:text-pearl focus:outline-none p-2 transition-colors"
          >
            <X size={32} strokeWidth={1} />
          </button>
        </div>
        <div className="px-10 pb-10 space-y-6 overflow-y-auto flex-1">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <Link 
                to={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`block text-xl font-serif tracking-tight transition-all duration-500 hover:pl-4 ${
                  location.pathname === link.href 
                    ? 'text-church-vibrant italic' 
                    : 'text-pearl/80 hover:text-pearl'
                }`}
              >
                {link.name}
              </Link>
              {index < navLinks.length - 1 && (
                <div className="h-px bg-white/5 w-full" />
              )}
            </React.Fragment>
          ))}
          <div className="pt-12 space-y-6">
            <Link 
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.3em] uppercase text-pearl/40 hover:text-pearl transition-colors"
            >
              <LayoutDashboard size={16} />
              Painel Admin
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col pt-36 md:pt-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!isAdminPage && (
        <footer className="bg-church-blue text-pearl pt-20 pb-12 mt-auto overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <span className="text-[20vw] font-serif italic leading-none vertical-text">Mutuá</span>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-16">
              
              {/* Coluna 1: Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <img 
                    src={siteConfig?.footerBannerUrl || "/banner.png"} 
                    alt="AD Mutuá Banner" 
                    className="h-32 w-auto object-contain" 
                    referrerPolicy="no-referrer"
                  />
                  <h4 className="text-2xl font-serif italic tracking-tight">AD Mutuá</h4>
                </div>
                <p className="text-pearl/60 leading-relaxed font-light">
                  Uma igreja que ama a Deus e ama as pessoas. Venha nos fazer uma visita e sinta o agir de Deus em sua vida.
                </p>
                <div className="flex space-x-6">
                  {contactConfig?.youtubeChannelUrl && (
                    <a href={contactConfig.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="text-pearl/40 hover:text-church-vibrant transition-colors">
                      <Youtube size={20} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>

              {/* Coluna 2: Contato */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-semibold tracking-[0.4em] uppercase text-church-vibrant">Contato</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 text-pearl/60 group">
                    <MapPin size={18} className="text-church-vibrant shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <span className="font-light leading-relaxed">{contactConfig?.address || 'R. Dr. Cumplido de Santana, 42 Mutua, São Gonçalo - RJ'}</span>
                  </li>
                  <li className="flex items-center gap-4 text-pearl/60 group">
                    <Phone size={18} className="text-church-vibrant shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-light">{contactConfig?.phone || '(21) 2713-5394'}</span>
                  </li>
                </ul>
              </div>

              {/* Coluna 3: Links */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-semibold tracking-[0.4em] uppercase text-church-vibrant">Explorar</h4>
                <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {navLinks.map(link => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-pearl/60 hover:text-pearl transition-colors text-sm font-light">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="border-t border-pearl/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-pearl/30 text-[10px] tracking-[0.2em] uppercase">
                &copy; {new Date().getFullYear()} Assembleia de Deus em Mutuá
              </p>
              <div className="flex gap-8">
                <span className="text-pearl/30 text-[10px] tracking-[0.2em] uppercase">São Gonçalo</span>
                <span className="text-pearl/30 text-[10px] tracking-[0.2em] uppercase">Rio de Janeiro</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
