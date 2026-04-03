import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Phone, LayoutDashboard, Maximize2, Minimize2, PictureInPicture2, ExternalLink, ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useFirestoreDoc } from '../../hooks/useFirestore';

const navLinks = [
  { name: 'Início', href: '/' },
  { 
    name: 'Nossa Igreja', 
    submenu: [
      { name: 'História', href: '/sobre' },
      { name: 'Liderança', href: '/lideranca' },
      { name: 'Departamentos', href: '/departamentos' },
      { name: 'Cultos', href: '/cultos' },
    ]
  },
  { name: 'Missões', href: '/missoes' },
  { name: 'EBD', href: '/ebd' },
  { name: 'Contato', href: '/contato' },
];

const extractYoutubeId = (urlOrId: string) => {
  if (!urlOrId) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/|shorts\/)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: contactConfig } = useFirestoreDoc<any>('config', 'contact');
  const { data: siteConfig, loading: loadingSite } = useFirestoreDoc<any>('config', 'site');

  const rawLiveVideoId = siteConfig?.liveVideoId || "";
  const liveVideoId = extractYoutubeId(rawLiveVideoId);
  const hasLiveStream = Boolean(liveVideoId && liveVideoId.length === 11);

  const isAdminPage = location.pathname.startsWith('/admin');

  const openPiP = async () => {
    if (!liveVideoId) {
      alert("Nenhuma transmissão ao vivo configurada no momento.");
      return;
    }

    // Se estiver dentro de iframe, pula direto pro popup
    if (window.self !== window.top) {
      abrirPopupFallback();
      return;
    }

    // Tenta Document Picture-in-Picture primeiro
    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 540,
          height: 340,
        });

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>AD Mutuá - Culto Ao Vivo</title>
            <style>
              body, html { 
                margin: 0; 
                padding: 0; 
                height: 100%; 
                background: #000; 
                overflow: hidden; 
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${liveVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin">
            </iframe>
          </body>
          </html>
        `;

        pipWindow.document.open();
        pipWindow.document.write(html);
        pipWindow.document.close();

        return;
      } catch (err) {
        console.warn("Document PiP falhou, usando fallback:", err);
      }
    }

    // Fallback: popup normal
    abrirPopupFallback();
  };

  const abrirPopupFallback = () => {
    const width = 540;
    const height = 340;
    const left = window.screen.width - width - 40;
    const top = window.screen.height - height - 120;

    window.open(
      `https://www.youtube-nocookie.com/embed/${liveVideoId}?autoplay=1&rel=0&modestbranding=1`,
      'ADMutuaLive',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );
  };

  React.useEffect(() => {
    const handleTogglePlayer = () => openPiP();
    window.addEventListener('toggle-live-player', handleTogglePlayer);
    return () => window.removeEventListener('toggle-live-player', handleTogglePlayer);
  }, [liveVideoId]);

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
          <header className="h-24 md:h-28 flex-shrink-0 flex items-center justify-between px-6 md:px-12 border-b border-church-blue/5">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-church-blue/60 hover:text-church-purple transition-all flex items-center gap-2">
            <ArrowLeft size={14} />
            Voltar ao Site
          </Link>
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="bg-church-purple text-white p-3 rounded-2xl hover:bg-church-purple-deep transition-all shadow-lg shadow-church-purple/20"
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
                {link.submenu ? (
                  <div className="space-y-4">
                    <span className="block text-xl font-serif tracking-tight text-pearl/40 italic">{link.name}</span>
                    <div className="pl-4 space-y-4 border-l border-white/10">
                      {link.submenu.map((sub) => (
                        <Link 
                          key={sub.name}
                          to={sub.href} 
                          onClick={() => setIsMenuOpen(false)}
                          className={`block text-lg font-serif tracking-tight transition-all duration-500 hover:pl-2 ${
                            location.pathname === sub.href 
                              ? 'text-church-vibrant italic' 
                              : 'text-pearl/80 hover:text-pearl'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={link.href!} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-xl font-serif tracking-tight transition-all duration-500 hover:pl-4 ${
                      location.pathname === link.href 
                        ? 'text-church-vibrant italic' 
                        : 'text-pearl/80 hover:text-pearl'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
                {index < navLinks.length - 1 && (
                  <div className="h-px bg-white/5 w-full" />
                )}
              </React.Fragment>
            ))}
            <div className="pt-12 space-y-6">
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl font-sans text-church-text flex flex-col">
      
      {/* Header / Navegação */}
      {!isAdminPage && (
        <header className="fixed top-0 w-full z-40">
          {/* Top Bar */}
          <div className="bg-church-blue text-pearl/60 py-2 border-b border-white/5">
            <div className="px-6 md:px-12 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em]">
              <div className="flex gap-6">
                <span className="flex items-center gap-2"><MapPin size={10} className="text-church-vibrant" /> São Gonçalo, RJ</span>
                <span className="hidden sm:flex items-center gap-2"><Phone size={10} className="text-church-vibrant" /> {contactConfig?.phone || '(21) 2713-5394'}</span>
              </div>
              <div className="flex gap-6">
              </div>
            </div>
          </div>

          <div className="bg-pearl/90 backdrop-blur-md border-b border-church-blue/5">
            <div className="px-6 md:px-12 lg:px-16">
              <div className="flex justify-between items-center h-20 md:h-24">
                
                {/* Logo - Fixed to left */}
                <Link to="/" className="flex-shrink-0 flex items-center gap-4 group">
                  <div className="relative">
                    {loadingSite ? (
                      <div className="h-16 md:h-20 w-24 md:w-32 bg-church-blue/5 animate-pulse rounded-xl" />
                    ) : (
                      <img 
                        src={siteConfig?.footerBannerUrl || "/banner.png"} 
                        alt="AD Mutuá" 
                        className="h-16 md:h-20 w-auto max-w-[120px] md:max-w-[180px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="hidden sm:block border-l border-church-blue/10 pl-4">
                    <span className="block font-serif text-lg md:text-xl tracking-tight leading-none text-church-blue">AD Mutuá</span>
                    <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-church-muted mt-1">Assembleia de Deus</span>
                  </div>
                </Link>

                {/* Desktop Navigation - Pushed to right for better distribution with logo on left */}
                <div className="hidden xl:flex items-center gap-2 ml-auto">
                  <nav className="flex items-center gap-1">
                    {navLinks.map((link) => (
                      <div key={link.name} className="relative group/nav">
                        {link.submenu ? (
                          <div className="flex items-center gap-1 px-3 py-2 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.2em] text-church-dark-deep hover:text-church-purple cursor-pointer transition-all duration-500">
                            <span>{link.name}</span>
                            <ChevronDown size={12} className="group-hover/nav:rotate-180 transition-transform duration-500" />
                            
                            {/* Submenu Dropdown */}
                            <div className="absolute top-full left-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-500 z-50">
                              <div className="bg-white rounded-2xl shadow-2xl border border-church-blue/5 py-4 min-w-[200px] overflow-hidden">
                                {link.submenu.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    to={sub.href}
                                    className={`block px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-church-blue/5 ${
                                      location.pathname === sub.href ? 'text-church-vibrant' : 'text-church-dark-deep hover:text-church-purple'
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link 
                            to={link.href!}
                            className={`px-3 py-2 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 relative group ${
                              location.pathname === link.href 
                                ? 'text-church-vibrant' 
                                : 'text-church-dark-deep hover:text-church-purple'
                            }`}
                          >
                            <span className="relative z-10">{link.name}</span>
                            
                            {/* Gold Accent Dot */}
                            {location.pathname === link.href && (
                              <motion.div 
                                layoutId="header-active-dot"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-church-vibrant rounded-full shadow-[0_0_8px_rgba(217,119,6,0.8)]"
                                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                              />
                            )}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Menu Button (Mobile/Tablet) */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsMenuOpen(true)} 
                    className="xl:hidden bg-church-purple text-white p-3 rounded-2xl hover:bg-church-purple-deep transition-all shadow-lg shadow-church-purple/20"
                  >
                    <Menu size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {!isAdminPage && isMenuOpen && (
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
      {!isAdminPage && (
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
                {link.submenu ? (
                  <div className="space-y-4">
                    <span className="block text-xl font-serif tracking-tight text-pearl/40 italic">{link.name}</span>
                    <div className="pl-4 space-y-4 border-l border-white/10">
                      {link.submenu.map((sub) => (
                        <Link 
                          key={sub.name}
                          to={sub.href} 
                          onClick={() => setIsMenuOpen(false)}
                          className={`block text-lg font-serif tracking-tight transition-all duration-500 hover:pl-2 ${
                            location.pathname === sub.href 
                              ? 'text-church-vibrant italic' 
                              : 'text-pearl/80 hover:text-church-vibrant'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={link.href!} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-xl font-serif tracking-tight transition-all duration-500 hover:pl-4 ${
                      location.pathname === link.href 
                        ? 'text-church-vibrant italic' 
                        : 'text-pearl/80 hover:text-church-vibrant'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
                {index < navLinks.length - 1 && (
                  <div className="h-px bg-white/5 w-full" />
                )}
              </React.Fragment>
            ))}
            <div className="pt-12 space-y-6">
            </div>
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col ${isAdminPage ? 'pt-0' : (location.pathname === '/' ? '' : 'pt-24 md:pt-28')}`}>
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
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-16">
              
              {/* Coluna 1: Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <img 
                    src={siteConfig?.footerBannerUrl || "/banner.png"} 
                    alt="AD Mutuá Banner" 
                    className="h-32 w-auto object-contain cursor-default select-none" 
                    referrerPolicy="no-referrer"
                    onClick={(e) => {
                      if (e.detail === 3) {
                        navigate('/admin');
                      }
                    }}
                  />
                  <h4 className="text-2xl font-serif italic tracking-tight">AD Mutuá</h4>
                </div>
                <p className="text-pearl/60 leading-relaxed font-light">
                  Uma igreja que ama a Deus e ama as pessoas. Venha nos fazer uma visita e sinta o agir de Deus em sua vida.
                </p>
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
                    <React.Fragment key={link.name}>
                      {link.submenu ? (
                        link.submenu.map(sub => (
                          <li key={sub.name}>
                            <Link to={sub.href} className="text-pearl/60 hover:text-church-vibrant transition-colors text-sm font-light flex items-center gap-2 group">
                              <span className="w-0 h-px bg-church-vibrant transition-all duration-300 group-hover:w-2"></span>
                              {sub.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link to={link.href!} className="text-pearl/60 hover:text-church-vibrant transition-colors text-sm font-light flex items-center gap-2 group">
                            <span className="w-0 h-px bg-church-vibrant transition-all duration-300 group-hover:w-2"></span>
                            {link.name}
                          </Link>
                        </li>
                      )}
                    </React.Fragment>
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
