import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Calendar, ArrowRight, X, MapPin, Phone, ExternalLink, Newspaper, Quote, ChevronLeft, ChevronRight, BookOpen, AlertCircle, PictureInPicture2 } from 'lucide-react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import { orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import Skeleton from '../components/ui/Skeleton';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isNewsExpanded, setIsNewsExpanded] = useState(false);
  const { data: specialEvents, loading: loadingEvents } = useFirestoreCollection<any>('events', orderBy('order', 'desc'));
  const { data: combinedUpdatesData, loading: loadingUpdates } = useFirestoreCollection<any>('updates', orderBy('createdAt', 'desc'), limit(8));
  const { data: ebdLessons, loading: loadingEbd } = useFirestoreCollection<any>('ebdLessons', orderBy('createdAt', 'desc'), limit(4));
  const { data: siteConfig, loading: loadingSite } = useFirestoreDoc<any>('config', 'site');
  const { data: leadership, loading: loadingLeadership } = useFirestoreDoc<any>('config', 'leadership');
  const { data: contactConfig, loading: loadingContact } = useFirestoreDoc<any>('config', 'contact');

  const filteredEvents = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return specialEvents.filter(event => {
      const start = event.displayStartDate;
      const end = event.displayEndDate;
      if (start && today < start) return false;
      if (end && today > end) return false;
      return true;
    });
  }, [specialEvents]);

  const navigate = useNavigate();

  // Auto-play timer for events (10 seconds)
  React.useEffect(() => {
    if (filteredEvents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % filteredEvents.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [filteredEvents.length]);

  // Auto-play timer for news (10 seconds)
  React.useEffect(() => {
    const newsCount = Math.min(combinedUpdatesData.length, 3);
    if (newsCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsCount);
    }, 10000);
    return () => clearInterval(timer);
  }, [combinedUpdatesData.length]);

  // Reset index if out of bounds
  React.useEffect(() => {
    if (currentEventIndex >= filteredEvents.length && filteredEvents.length > 0) {
      setCurrentEventIndex(0);
    }
  }, [filteredEvents.length, currentEventIndex]);

  React.useEffect(() => {
    const newsCount = Math.min(combinedUpdatesData.length, 3);
    if (currentNewsIndex >= newsCount && newsCount > 0) {
      setCurrentNewsIndex(0);
    }
  }, [combinedUpdatesData.length, currentNewsIndex]);

  const handleHowToGetThere = (e: React.MouseEvent) => {
    e.preventDefault();
    const address = contactConfig?.address || "R. Dr. Cumplido de Santana, 42, Mutua, São Gonçalo - RJ";
    const encodedAddress = encodeURIComponent(address);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      window.location.href = `maps://maps.apple.com/?daddr=${encodedAddress}`;
    } else if (isAndroid) {
      window.location.href = `geo:0,0?q=${encodedAddress}`;
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  // Combine updates from different sources
  const combinedUpdates = React.useMemo(() => {
    const items: any[] = [];

    // Add items from the 'updates' collection
    combinedUpdatesData.forEach(u => {
      items.push({ ...u, type: u.type || 'news' });
    });

    // Add latest events (only if they have createdAt)
    filteredEvents.forEach(e => {
      if (e.createdAt) {
        items.push({
          id: e.id,
          title: `Nova Programação: ${e.title}`,
          description: e.theme,
          date: e.date,
          imageUrl: e.imageUrl,
          createdAt: e.createdAt,
          type: 'event',
          original: e
        });
      }
    });

    // Add leadership message if updated
    if (leadership?.updatedAt) {
      const dateObj = leadership.updatedAt?.toDate ? leadership.updatedAt.toDate() : new Date();
      items.push({
        id: 'leadership-update',
        title: "Nova Mensagem Pastoral",
        description: leadership.message,
        date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
        imageUrl: leadership.imageUrl,
        createdAt: leadership.updatedAt,
        type: 'pastoral'
      });
    }

    // Add latest EBD lessons (only if they have createdAt)
    ebdLessons.forEach(l => {
      if (l.createdAt) {
        const dateObj = l.createdAt?.toDate ? l.createdAt.toDate() : new Date();
        items.push({
          id: l.id,
          title: `Nova Lição EBD: ${l.lessonTitle}`,
          description: `Trimestre ${l.quarterNumber} • Lição ${l.lessonNumber}`,
          date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
          createdAt: l.createdAt,
          type: 'ebd',
          original: l
        });
      }
    });

    // Sort by createdAt desc
    return items.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const timeB = b.createdAt?.toMillis?.() || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return timeB - timeA;
    }).slice(0, 8); // Show up to 8 recent updates
  }, [combinedUpdatesData, filteredEvents, leadership, ebdLessons]);

  const handleUpdateClick = (update: any) => {
    if (update.type === 'event') {
      setSelectedEvent(update.original);
    } else if (update.type === 'pastoral') {
      navigate('/lideranca');
    } else if (update.type === 'ebd') {
      navigate('/ebd');
    } else if (update.type === 'missionary') {
      navigate('/missoes');
    } else if (update.type === 'news') {
      navigate(`/noticias/${update.id}`);
    } else if (update.link) {
      window.open(update.link, '_blank');
    }
  };

  const heroTitle = siteConfig?.heroTitle || "Bem-vindo à Assembleia de Deus em Mutuá";
  const heroSubtitle = siteConfig?.heroSubtitle || "Um lugar de paz, fé e comunhão. Venha fazer parte da nossa família e viver o amor de Cristo.";
  const heroBackgroundImage = siteConfig?.heroBackgroundImage || "/hero-bg.png";
  const liveVideoId = siteConfig?.liveVideoId || "";
  const hasLiveStream = Boolean(liveVideoId && liveVideoId.trim() !== "");
  const [isLocalVideoPlaying, setIsLocalVideoPlaying] = useState(true);

  React.useEffect(() => {
    const handleTogglePlayer = () => {
      setIsLocalVideoPlaying(false);
    };
    window.addEventListener('toggle-live-player', handleTogglePlayer);
    return () => window.removeEventListener('toggle-live-player', handleTogglePlayer);
  }, []);

  return (
    <div className="flex flex-col bg-pearl">
      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackgroundImage} 
            alt="Church" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-church-blue/70 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-church-blue/20 to-church-blue/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full pt-48 md:pt-56 pb-20">
          <div className="max-w-3xl">
            <ScrollReveal direction="right">
              <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.5em] uppercase mb-6 block">
                Assembleia de Deus em Mutuá
              </span>
              <h1 className="text-4xl md:text-7xl text-pearl mb-8 leading-[0.9] font-serif italic">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-pearl/70 mb-12 font-light leading-relaxed max-w-xl">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/cultos" className="btn-minimal bg-church-vibrant text-church-blue border-none">
                  Nossos Cultos
                </Link>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactConfig?.address || "R. Dr. Cumplido de Santana, 42, Mutua, São Gonçalo - RJ")}`}
                  onClick={handleHowToGetThere}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-minimal text-pearl border-pearl/30"
                >
                  Como Chegar
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>

      </section>

      {/* News & Updates Section */}
      {(loadingUpdates || combinedUpdatesData.length > 0 || combinedUpdates.length > 0) && (
        <section className="pt-8 pb-12 px-6 md:px-12 lg:px-20 bg-pearl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-church-vibrant/20 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Left Side: News */}
              <div className="lg:col-span-2">
                <ScrollReveal className="mb-10">
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Fique Informado</span>
                  <h2 className="text-4xl md:text-6xl text-church-blue leading-tight mb-4">Notícias</h2>
                  <p className="text-church-muted font-light max-w-sm leading-relaxed">
                    Acompanhe as últimas novidades e acontecimentos da nossa comunidade.
                  </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {loadingUpdates ? (
                    <>
                      <div className="md:col-span-2 lg:col-span-1 space-y-8">
                        <Skeleton className="aspect-[16/10] rounded-[2.5rem]" />
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      </div>
                      <div className="space-y-10">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex gap-6">
                            <Skeleton className="w-28 h-28 md:w-36 md:h-36 rounded-3xl flex-shrink-0" />
                            <div className="space-y-3 flex-1 pt-1">
                              <Skeleton className="h-3 w-20" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Featured News */}
                      {combinedUpdatesData[0] && (
                        <ScrollReveal direction="right" className="md:col-span-2 lg:col-span-1">
                          <Link 
                            to={`/noticias/${combinedUpdatesData[0].id}`} 
                            className="group block"
                          >
                            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl mb-8">
                              <img 
                                src={combinedUpdatesData[0].imageUrl} 
                                alt={combinedUpdatesData[0].title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-church-blue text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                                  Destaque
                                </span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <span className="text-church-vibrant text-[10px] font-bold tracking-widest uppercase">{combinedUpdatesData[0].date}</span>
                                <div className="w-1 h-1 rounded-full bg-church-blue/20"></div>
                                <span className="text-church-muted/60 text-[10px] font-bold tracking-widest uppercase">Notícia</span>
                              </div>
                              <h3 className="text-3xl md:text-4xl text-church-blue font-serif italic leading-tight group-hover:text-church-vibrant transition-colors duration-300">
                                {combinedUpdatesData[0].title}
                              </h3>
                              <p className="text-church-muted font-light leading-relaxed line-clamp-3 text-lg">
                                {combinedUpdatesData[0].description}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors">
                                Ler Notícia Completa <ArrowRight size={14} />
                              </div>
                            </div>
                          </Link>
                        </ScrollReveal>
                      )}

                      {/* Secondary News List */}
                      <div className="space-y-10">
                        {combinedUpdatesData.slice(1, 4).map((news: any, idx: number) => (
                          <ScrollReveal key={news.id} direction="left" delay={idx * 0.1}>
                            <Link 
                              to={`/noticias/${news.id}`} 
                              className="group flex gap-6 items-start"
                            >
                              <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-3xl overflow-hidden shadow-lg">
                                <img 
                                  src={news.imageUrl} 
                                  alt={news.title} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="space-y-3 pt-1">
                                <span className="text-church-vibrant text-[9px] font-bold tracking-widest uppercase">
                                  {news.date}
                                </span>
                                <h3 className="text-lg md:text-xl text-church-blue font-serif italic leading-tight group-hover:text-church-vibrant transition-colors duration-300 line-clamp-2">
                                  {news.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors">
                                  Ler mais <ArrowRight size={12} />
                                </div>
                              </div>
                            </Link>
                          </ScrollReveal>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side: Recent Updates Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <ScrollReveal className="mb-8">
                    <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Fique por dentro</span>
                    <h2 className="text-3xl text-church-blue leading-tight">Últimas Novidades</h2>
                  </ScrollReveal>

                  <div className={`relative ${!isNewsExpanded ? 'lg:max-h-[450px]' : 'max-h-none'} overflow-hidden transition-all duration-700 ease-in-out`}>
                    <div className="space-y-6">
                      {loadingEvents || loadingLeadership || loadingEbd || loadingUpdates ? (
                        [1, 2, 3, 4].map(i => (
                          <div key={i} className="pl-8 border-l border-church-blue/10 space-y-3">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))
                      ) : (
                        combinedUpdates.map((update: any, idx: number) => (
                          <ScrollReveal
                            key={update.id}
                            direction="left"
                            delay={idx * 0.05}
                            className="group relative pl-8 border-l border-church-blue/10 hover:border-church-vibrant transition-colors duration-500 cursor-pointer"
                            onClick={() => handleUpdateClick(update)}
                          >
                            <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-church-blue/20 group-hover:bg-church-vibrant transition-colors"></div>
                            
                            <div className="mb-2 flex items-center gap-3">
                              <span className="text-[9px] font-bold tracking-widest uppercase text-church-vibrant">
                                {update.type === 'event' ? 'Programação' : update.type === 'pastoral' ? 'Pastoral' : update.type === 'ebd' ? 'EBD' : update.type === 'missionary' ? 'Missões' : 'Notícia'}
                              </span>
                              <span className="text-[9px] text-church-muted/60 uppercase tracking-widest">{update.date}</span>
                            </div>

                            <h3 className="text-lg text-church-blue font-serif italic mb-3 leading-tight group-hover:text-church-vibrant transition-colors">
                              {update.title}
                            </h3>
                            
                            <p className="text-sm text-church-muted font-light leading-relaxed mb-2 line-clamp-2 italic">
                              {update.type === 'pastoral' ? `"${update.description}"` : update.description}
                            </p>

                            <div>
                              {update.type === 'event' ? (
                                <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                                  Ver Detalhes <ArrowRight size={12} />
                                </div>
                              ) : update.type === 'pastoral' ? (
                                <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                                  Ler Mensagem <Quote size={12} />
                                </div>
                              ) : update.type === 'ebd' ? (
                                <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                                  Ler Lição <BookOpen size={12} />
                                </div>
                              ) : update.type === 'missionary' ? (
                                <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                                  Ver Missões <ArrowRight size={12} />
                                </div>
                              ) : (
                                <div className="text-[9px] font-bold uppercase tracking-widest text-church-blue group-hover:text-church-vibrant transition-colors flex items-center gap-2">
                                  Ler mais <ArrowRight size={12} />
                                </div>
                              )}
                            </div>
                          </ScrollReveal>
                        ))
                      )}
                    </div>

                    {/* Gradient overlay when collapsed */}
                    {!isNewsExpanded && combinedUpdates.length > 3 && (
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pearl to-transparent pointer-events-none"></div>
                    )}
                  </div>

                  {combinedUpdates.length > 3 && (
                    <button 
                      onClick={() => setIsNewsExpanded(!isNewsExpanded)}
                      className="mt-6 flex items-center gap-2 text-church-vibrant text-[10px] font-bold uppercase tracking-widest hover:text-church-blue transition-colors group"
                    >
                      {isNewsExpanded ? 'Ver Menos' : 'Ver Mais Novidades'}
                      <motion.div
                        animate={{ rotate: isNewsExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight size={14} className="rotate-90" />
                      </motion.div>
                    </button>
                  )}

                  <div className="mt-4 pt-4 border-t border-church-blue/5">
                    {/* Link removido temporariamente pois a página não existe */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Events Banner Section - Cinematic Editorial Version */}
      {loadingEvents ? (
        <section className="relative min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-church-blue py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="text-center mb-10 md:mb-16 space-y-4">
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-16 w-3/4 mx-auto" />
            </div>
            <Skeleton className="w-full max-w-5xl h-[500px] rounded-[3rem] mx-auto" />
          </div>
        </section>
      ) : filteredEvents.length > 0 && (
        <section className="relative min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-church-blue py-16 md:py-24">
          {/* Atmospheric Background Layer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${filteredEvents[currentEventIndex]?.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={filteredEvents[currentEventIndex]?.imageUrl} 
                className="w-full h-full object-cover blur-[80px] scale-110"
                referrerPolicy="no-referrer"
                alt=""
              />
              <div className="absolute inset-0 bg-church-blue/60"></div>
            </motion.div>
          </AnimatePresence>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <ScrollReveal className="text-center mb-10 md:mb-16">
              <span className="text-church-vibrant text-[10px] font-bold tracking-[0.6em] uppercase mb-3 md:mb-4 block">
                Não Perca
              </span>
              <h2 className="text-3xl md:text-7xl text-white font-serif italic leading-tight">
                Programações <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Especiais</span>
              </h2>
            </ScrollReveal>

            <div className="relative flex items-center justify-center">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredEvents.map((event: any, idx: number) => {
                  if (idx !== currentEventIndex) return null;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9, x: 100, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.1, x: -100, filter: 'blur(10px)' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl md:rounded-[3rem] overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                    >
                      {/* Image Side */}
                      <div className="relative lg:col-span-7 aspect-video overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-church-blue/80 via-transparent to-transparent lg:hidden"></div>
                      </div>

                      {/* Content Side */}
                      <div className="p-6 md:p-10 lg:col-span-5 flex flex-col justify-center relative">
                        <div className="space-y-4 md:space-y-6">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="px-4 py-1.5 rounded-full bg-church-vibrant text-church-blue text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-church-vibrant/20">
                              {event.date}
                            </div>
                            {event.hasLimitedSpots && (
                              <div className="px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold tracking-widest uppercase shadow-lg flex items-center gap-1.5">
                                <AlertCircle size={12} />
                                Vagas Limitadas
                              </div>
                            )}
                            <div className="h-px flex-1 bg-white/10 min-w-[2rem]"></div>
                          </div>

                          <h3 className="text-2xl md:text-4xl text-white font-serif italic leading-tight">
                            {event.title}
                          </h3>

                          <p className="text-pearl/60 text-base md:text-lg font-light italic leading-relaxed">
                            "{event.theme}"
                          </p>

                          <div className="grid grid-cols-2 gap-6 pt-4">
                            {event.location && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-church-vibrant/60">Local</span>
                                <p className="text-white/80 text-xs font-medium truncate">{event.location}</p>
                              </div>
                            )}
                            {event.hasLimitedSpots && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-church-vibrant/60">Aviso</span>
                                <p className="text-white/80 text-xs font-medium">Vagas Limitadas</p>
                              </div>
                            )}
                          </div>

                          <div className="pt-6">
                            <button 
                              onClick={() => setSelectedEvent(event)}
                              className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-church-blue transition-all duration-300 bg-church-vibrant rounded-2xl hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 w-full sm:w-auto"
                            >
                              Ver Detalhes da Programação
                              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Navigation Controls - Cinematic Style */}
            {filteredEvents.length > 1 && (
              <ScrollReveal delay={0.4} className="flex flex-col items-center gap-8 mt-10 md:mt-12">
                <div className="flex items-center gap-6 md:gap-12">
                  <button 
                    onClick={() => setCurrentEventIndex((prev) => (prev === 0 ? filteredEvents.length - 1 : prev - 1))}
                    className="group flex items-center gap-3 text-white/40 hover:text-church-vibrant transition-all"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-church-vibrant/30 group-hover:bg-church-vibrant/5 transition-all">
                      <ChevronLeft size={18} md:size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">Anterior</span>
                  </button>

                  <div className="flex gap-2 md:gap-3">
                    {filteredEvents.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setCurrentEventIndex(i)}
                        className={`h-1 md:h-1.5 rounded-full transition-all duration-700 ${i === currentEventIndex ? 'w-8 md:w-12 bg-church-vibrant shadow-[0_0_15px_rgba(0,255,0,0.3)]' : 'w-2 md:w-3 bg-white/10 hover:bg-white/30'}`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentEventIndex((prev) => (prev === filteredEvents.length - 1 ? 0 : prev + 1))}
                    className="group flex items-center gap-3 text-white/40 hover:text-church-vibrant transition-all"
                  >
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block">Próximo</span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-church-vibrant/30 group-hover:bg-church-vibrant/5 transition-all">
                      <ChevronRight size={18} md:size={20} strokeWidth={1.5} />
                    </div>
                  </button>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Live Stream Section */}
      <section className="section-padding bg-[#050B14] text-pearl relative overflow-hidden min-h-[60vh] flex items-center">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {loadingSite ? (
            <div className="absolute inset-0 bg-church-blue/90"></div>
          ) : siteConfig?.liveBackgroundImageUrl ? (
            <>
              <img 
                src={siteConfig.liveBackgroundImageUrl} 
                alt="Live Background" 
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-church-blue/70 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-church-blue/20 to-church-blue/90"></div>
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
              <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-church-blue/20 rounded-full blur-[150px] mix-blend-screen"></div>
            </>
          )}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`flex flex-col ${hasLiveStream ? 'lg:flex-row' : 'items-center text-center'} items-center gap-12 lg:gap-16`}>
            <div className={`${hasLiveStream ? 'lg:w-1/2' : 'max-w-3xl'} space-y-6`}>
              {loadingSite ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-48 rounded-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  {hasLiveStream && (
                    <ScrollReveal direction="down">
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        Transmissão ao Vivo
                      </div>
                    </ScrollReveal>
                  )}
                  
                  <ScrollReveal delay={0.1}>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-serif italic text-white">
                      Acompanhe Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Cultos Online</span>
                    </h2>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.2}>
                    <p className={`text-lg text-pearl/60 font-light leading-relaxed ${hasLiveStream ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}>
                      Não pode estar presente fisicamente? Junte-se a nós em nossa transmissão ao vivo pelo YouTube. 
                      Adore ao Senhor conosco de onde você estiver, com a mesma fé e comunhão.
                    </p>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.3} className={`flex flex-wrap gap-4 pt-2 ${hasLiveStream ? '' : 'justify-center'}`}>
                    {hasLiveStream && (
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('toggle-live-player'))}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:-translate-y-1"
                        title="Assista ao culto enquanto navega pelo site"
                      >
                        <div className="flex items-center">
                          <div className="relative mr-3">
                            <img src="/botao-de-reproducao-do-youtube-com-renderizacao-3d.png" alt="" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                          </div>
                          <span className="flex flex-col items-start leading-none">
                            <span className="text-xs font-medium opacity-70 mb-0.5 uppercase tracking-wider">Modo Multitarefa</span>
                            <span>Assistir e Navegar</span>
                          </span>
                          <PictureInPicture2 size={18} className="ml-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    )}
                    <Link 
                      to="/cultos" 
                      className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:-translate-y-1"
                    >
                      Ver Horários
                    </Link>
                  </ScrollReveal>
                </>
              )}
            </div>

            {hasLiveStream && (
              <ScrollReveal direction="left" delay={0.5} className="lg:w-1/2 w-full relative perspective-1000">
                {/* Decorative glow behind video */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/30 to-church-blue/30 blur-3xl rounded-[4rem] opacity-50 animate-pulse"></div>
                
                <div className="relative p-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                  <div className="aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden relative group">
                    <iframe
                      key={isLocalVideoPlaying ? 'playing' : 'paused'}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=${isLocalVideoPlaying ? 0 : 0}&mute=0`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700 relative z-10"
                    ></iframe>
                    
                    {/* Subtle overlay to blend iframe with the dark theme when not hovered */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/80 to-transparent pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity duration-700 z-20"></div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-church-blue/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-pearl rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 z-10 bg-pearl/80 backdrop-blur-sm p-3 rounded-full text-church-blue hover:bg-church-vibrant hover:text-pearl transition-all shadow-sm"
              >
                <X size={24} strokeWidth={1.5} />
              </button>

              <div className="flex flex-col">
                <div className="w-full aspect-video relative overflow-hidden shrink-0">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-church-blue/60 to-transparent"></div>
                </div>

                <div className="p-8 md:p-12 w-full">
                  <span className="text-church-vibrant text-[10px] font-semibold tracking-[0.4em] uppercase mb-4 block">Detalhes da Programação</span>
                  <h2 className="text-4xl md:text-5xl text-church-blue mb-10 leading-tight italic">{selectedEvent.title}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted flex items-center gap-2">
                        <Calendar size={14} className="text-church-vibrant" />
                        Data
                      </h4>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-lg text-church-blue font-light">{selectedEvent.date}</p>
                        {selectedEvent.hasLimitedSpots && (
                          <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <AlertCircle size={12} />
                            Vagas Limitadas
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedEvent.location && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted flex items-center gap-2">
                          <MapPin size={14} className="text-church-vibrant" />
                          Local
                        </h4>
                        <p className="text-lg text-church-blue font-light">{selectedEvent.location}</p>
                      </div>
                    )}
                    {selectedEvent.contactPhone && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted flex items-center gap-2">
                          <Phone size={14} className="text-church-vibrant" />
                          Contato
                        </h4>
                        <p className="text-lg text-church-blue font-light">{selectedEvent.contactPhone}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted">Tema</h4>
                      <p className="text-lg text-church-blue font-light italic">"{selectedEvent.theme}"</p>
                    </div>
                  </div>

                  {selectedEvent.details && (
                    <div className="mb-12">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted mb-4">Sobre a Programação</h4>
                      <div className="text-church-text/80 leading-relaxed font-light whitespace-pre-wrap text-lg">
                        {selectedEvent.details}
                      </div>
                    </div>
                  )}

                  {selectedEvent.additionalImages && selectedEvent.additionalImages.length > 0 && (
                    <div className="mb-12">
                      <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-church-muted mb-6">Galeria</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedEvent.additionalImages.map((img: string, idx: number) => (
                          <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-church-vibrant/10">
                            <img 
                              src={img} 
                              alt={`Galeria ${idx + 1}`} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-10 border-t border-church-vibrant/10 flex flex-col sm:flex-row gap-6">
                    <Link 
                      to="/contato" 
                      onClick={() => setSelectedEvent(null)}
                      className="btn-minimal bg-church-blue text-pearl border-none flex-1 text-center"
                    >
                      Quero Participar
                    </Link>
                    {(selectedEvent.link && (
                      <a 
                        href={selectedEvent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-minimal flex-1 text-center"
                      >
                        Site Oficial
                      </a>
                    )) || (
                      <button 
                        onClick={() => setSelectedEvent(null)}
                        className="btn-minimal flex-1 text-center"
                      >
                        Fechar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}